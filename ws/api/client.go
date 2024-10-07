package api

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 1024
)

type Client struct {
	name string
	conn *websocket.Conn
	send chan inRoom
	room *Room
	hub  *Hub
}

type lobbyResponse struct {
	Id       int64  `json:"id"`
	RoomName string `json:"room_name"`
	Owner    string `json:"owner"`
}

func (s *Server) lobby(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade lobby: %v\n", err)
		return
	}

	go func() {
		ticker := time.NewTicker(pingPeriod)
		responseTicker := time.NewTicker(5 * time.Second)
		defer func() {
			ticker.Stop()
			responseTicker.Stop()
			conn.Close()
		}()

		conn.SetPongHandler(func(string) error { conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
		for {
			select {
			case <-ticker.C:
				conn.SetWriteDeadline(time.Now().Add(writeWait))
				if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
					return
				}
			case <-responseTicker.C:
				conn.SetWriteDeadline(time.Now().Add(writeWait))
				var rooms []lobbyResponse

				for _, room := range s.hub.rooms {
					rooms = append(rooms, lobbyResponse{
						Id:       room.id,
						RoomName: room.name,
						Owner:    room.player[0].name,
					})
				}

				err := conn.WriteJSON(rooms)
				if err != nil {
					log.Printf("Failed to write rooms to client: %v\n", err)
					return
				}
			}
		}
	}()
}

type createRoomRequest struct {
	Player   string `json:"player"`
	RoomName string `json:"room_name"`
}

type createRoomResponse struct {
	RoomId int64 `json:"room_id"`
}

func (s *Server) createRoom(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade websocket at creating room: %v\n", err)
		return
	}

	go func() {
		conn.SetReadLimit(maxMessageSize)
		conn.SetReadDeadline(time.Now().Add(pongWait))
		conn.SetPongHandler(func(string) error { conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

		var req createRoomRequest
		err := conn.ReadJSON(&req)
		if err != nil {
			log.Printf("Failed to read create room request: %v\n", err)
			conn.Close()
			return
		}

		id := s.hub.unusedRoomId()
		if id == 0 {
			conn.Close()
			return
		}
		room := createRoom(id, req.RoomName)
		client := createClient(req.Player, conn, room, s.hub)
		go room.run()
		room.register <- client

		err = conn.WriteJSON(createRoomResponse{
			RoomId: id,
		})
		if err != nil {
			log.Printf("Failed to write create room response: %v\n", err)
			if client.hub != nil {
				client.hub.unregister <- room
			}
			conn.Close()
			return
		}

		client.hub.register <- room

		go client.readPump()
		go client.writePump()
	}()
}

type joinRoomRequest struct {
	Player string `json:"player"`
	RoomId int64  `json:"room_id"`
}

type joinRoomResponse struct {
	Ready string `json:"ready"`
}

func (s *Server) joinRoom(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade websocket at joining room")
		return
	}

	go func() {
		conn.SetReadLimit(maxMessageSize)
		conn.SetReadDeadline(time.Now().Add(pongWait))
		conn.SetPongHandler(func(string) error { conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

		var req joinRoomRequest
		err := conn.ReadJSON(&req)
		if err != nil {
			log.Printf("Failed to read join request: %v", err)
			conn.Close()
			return
		}

		room, ok := s.hub.rooms[req.RoomId]

		if !ok || room == nil || room.player[1] != nil {
			conn.Close()
			return
		}

		client := createClient(req.Player, conn, room, s.hub)
		client.room.register <- client

		res := joinRoomResponse{
			Ready: "OK",
		}
		err = conn.WriteJSON(res)
		if err != nil {
			log.Printf("Failed to write ready response: %v", err)
			conn.Close()
			return
		}

		go client.readPump()
		go client.writePump()
	}()
}

type inRoom struct {
	Player    string `json:"player"`
	Ready     int8   `json:"ready"`
	GameState int8   `json:"game_state"`
	Data      string `json:"data"`
}

func (c *Client) readPump() {
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	defer func() {
		if c == c.room.player[0] {
			c.hub.unregister <- c.room
		} else if c == c.room.player[1] {
			c.room.unregister <- c
		}
		c.conn.Close()
	}()
	for {
		var message inRoom
		err := c.conn.ReadJSON(&message)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Failed to read pump message: %v", err)
			}
			break
		}
		c.room.broadcast <- message
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			msg, err := json.Marshal(message)
			if err != nil {
				log.Printf("Failed to marshal message: %v", err)
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(msg)

			n := len(c.send)
			for i := 0; i < n; i++ {
				msg, err := json.Marshal(<-c.send)
				if err != nil {
					log.Printf("Failed to marshal nextwriter message: %v", err)
					continue
				}
				w.Write(msg)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func createClient(name string, conn *websocket.Conn, room *Room, hub *Hub) *Client {
	return &Client{
		name: name,
		conn: conn,
		send: make(chan inRoom, 100),
		room: room,
		hub:  hub,
	}
}

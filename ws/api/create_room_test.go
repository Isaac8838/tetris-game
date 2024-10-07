package api

import (
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/require"
)

func TestCreateRoom(t *testing.T) {
	type request struct {
		Player   string `json:"player"`
		RoomName string `json:"room_name"`
	}
	type response struct {
		RoomId int64 `json:"room_id"`
	}
	testCases := []struct {
		name       string
		req        request
		data       []inRoom
		action     func(url string, server *Server, req request, data []inRoom) int64
		afterCheck func(server *Server, id int64)
	}{
		{
			name: "OK",
			req: request{
				Player:   "1",
				RoomName: "1",
			},
			data: []inRoom{
				{
					Player:    "1",
					Ready:     0,
					GameState: 0,
					Data:      "",
				},
				{
					Player:    "2",
					Ready:     0,
					GameState: 0,
					Data:      "",
				},
			},
			action: func(url string, s *Server, req request, data []inRoom) int64 {
				wsURL := "ws" + strings.TrimPrefix(url, "http")
				clientConn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
				require.NoError(t, err)

				clientConn.SetReadDeadline(time.Now().Add(pongWait))

				var res response
				err = clientConn.WriteJSON(req)
				require.NoError(t, err)
				err = clientConn.ReadJSON(&res)
				require.NoError(t, err)

				defer clientConn.Close()

				time.Sleep(1 * time.Second)
				room, ok := s.hub.rooms[res.RoomId]
				require.True(t, ok)
				client := createClient("2", nil, room, s.hub)
				client.room.register <- client

				for k := 0; k < 2; k++ {
					err = clientConn.WriteJSON(data[0])
					require.NoError(t, err)
					client.room.broadcast <- data[1]

					clientConn.SetReadDeadline(time.Now().Add(pongWait))
					var recv [2]inRoom
					err = clientConn.ReadJSON(&recv[1])
					require.NoError(t, err)
					recv[0], ok = <-client.send
					require.True(t, ok)
					for i := 0; i < 2; i++ {
						require.Equal(t, data[i].Player, recv[i].Player)
						require.Equal(t, data[i].Ready, recv[i].Ready)
						require.Equal(t, data[i].GameState, recv[i].GameState)
						require.Equal(t, data[i].Data, recv[i].Data)
					}
				}

				return res.RoomId
			},
			afterCheck: func(s *Server, id int64) {
				time.Sleep(1 * time.Second)
				_, ok := s.hub.rooms[id]
				require.True(t, !ok)
			},
		},
		{
			name: "OK with no join",
			req: request{
				Player:   "1",
				RoomName: "1",
			},
			data: []inRoom{
				{
					Player:    "1",
					Ready:     0,
					GameState: 0,
					Data:      "",
				},
			},
			action: func(url string, s *Server, req request, data []inRoom) int64 {
				wsURL := "ws" + strings.TrimPrefix(url, "http")
				clientConn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
				require.NoError(t, err)

				clientConn.SetReadDeadline(time.Now().Add(pongWait))

				var res response
				err = clientConn.WriteJSON(req)
				require.NoError(t, err)
				err = clientConn.ReadJSON(&res)
				require.NoError(t, err)

				defer clientConn.Close()

				time.Sleep(1 * time.Second)
				_, ok := s.hub.rooms[res.RoomId]
				require.True(t, ok)

				for i := 0; i < 2; i++ {
					err = clientConn.WriteJSON(data[0])
					require.NoError(t, err)

					clientConn.SetReadDeadline(time.Now().Add(pongWait))
					var recv inRoom
					err = clientConn.ReadJSON(&recv)
					require.NoError(t, err)

					require.Equal(t, "", recv.Player)
					require.Equal(t, int8(0), recv.Ready)
					require.Equal(t, int8(0), recv.GameState)
					require.Equal(t, "", recv.Data)
				}

				return res.RoomId
			},
			afterCheck: func(s *Server, id int64) {
				time.Sleep(1 * time.Second)
				_, ok := s.hub.rooms[id]
				require.True(t, !ok)
			},
		},
		{
			name: "OK with join leave",
			req: request{
				Player:   "1",
				RoomName: "1",
			},
			data: []inRoom{
				{
					Player:    "1",
					Ready:     0,
					GameState: 0,
					Data:      "",
				},
				{
					Player:    "2",
					Ready:     0,
					GameState: 0,
					Data:      "",
				},
			},
			action: func(url string, s *Server, req request, data []inRoom) int64 {
				wsURL := "ws" + strings.TrimPrefix(url, "http")
				clientConn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
				require.NoError(t, err)
				defer clientConn.Close()

				clientConn.SetReadDeadline(time.Now().Add(pongWait))
				var res response
				err = clientConn.WriteJSON(req)
				require.NoError(t, err)
				err = clientConn.ReadJSON(&res)
				require.NoError(t, err)
				time.Sleep(1 * time.Second)
				room, ok := s.hub.rooms[res.RoomId]
				require.True(t, ok)

				client := createClient("2", nil, room, s.hub)
				room.register <- client
				err = clientConn.WriteJSON(data[0])
				require.NoError(t, err)
				client.room.broadcast <- data[1]

				clientConn.SetReadDeadline(time.Now().Add(pongWait))
				var recv [2]inRoom
				err = clientConn.ReadJSON(&recv[1])
				require.NoError(t, err)
				recv[0], ok = <-client.send
				require.True(t, ok)
				for i := 0; i < 2; i++ {
					require.Equal(t, data[i].Player, recv[i].Player)
					require.Equal(t, data[i].Ready, recv[i].Ready)
					require.Equal(t, data[i].GameState, recv[i].GameState)
					require.Equal(t, data[i].Data, recv[i].Data)
				}
				room.unregister <- client

				time.Sleep(1 * time.Second)
				require.Equal(t, (*Client)(nil), room.player[1])

				err = clientConn.WriteJSON(data[0])
				require.NoError(t, err)
				clientConn.SetReadDeadline(time.Now().Add(pongWait))
				err = clientConn.ReadJSON(&recv[0])
				require.NoError(t, err)
				require.Equal(t, "", recv[0].Player)
				require.Equal(t, int8(0), recv[0].Ready)
				require.Equal(t, int8(0), recv[0].GameState)
				require.Equal(t, "", recv[0].Data)

				return res.RoomId
			},
			afterCheck: func(s *Server, id int64) {
				time.Sleep(1 * time.Second)
				_, ok := s.hub.rooms[id]
				require.True(t, !ok)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			config := newTestConfig()
			hub := NewHub()
			upgrader := newTestUpgrader()

			server, err := newTestServer(config, hub, upgrader)
			require.NoError(t, err)

			url := startTestServer(server.createRoom)

			roomId := tc.action(url, server, tc.req, tc.data)
			tc.afterCheck(server, roomId)
		})
	}
}

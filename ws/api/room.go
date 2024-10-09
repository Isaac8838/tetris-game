package api

import (
	"log"
	"time"
)

type Room struct {
	id             int64
	name           string
	player         [2]*Client
	broadcast      chan inRoom
	registerOwner  chan *Client
	registerPlayer chan *Client
	unregister     chan *Client
	quit           chan struct{}
}

func createRoom(id int64, name string) *Room {
	return &Room{
		id:             id,
		name:           name,
		player:         [2]*Client{nil, nil},
		broadcast:      make(chan inRoom),
		registerOwner:  make(chan *Client),
		registerPlayer: make(chan *Client),
		unregister:     make(chan *Client),
		quit:           make(chan struct{}),
	}
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.registerOwner:
			if r.player[0] == nil {
				r.player[0] = client
			} else {
				client.conn.Close()
			}
		case client := <-r.registerPlayer:
			if r.player[1] == nil {
				r.player[1] = client
			} else {
				client.conn.Close()
			}
		case client := <-r.unregister:
			if client != nil {
				close(client.send)
			}
			r.player[1] = nil
		case message := <-r.broadcast:
			if r.player[1] == nil && r.player[0].name == message.Player {
				log.Printf("There is no player joining at room %s and own by %s", r.name, r.player[0].name)
				select {
				case r.player[0].send <- inRoom{Player: "", Ready: 0, GameState: 0, Data: ""}:
				default:
					close(r.player[0].send)
				}
			}
			for _, p := range r.player {
				if p != nil && p.name != message.Player {
					log.Printf("Sending message from %s to %s at room %s", message.Player, p.name, r.name)
					select {
					case p.send <- message:
					default:
						close(p.send)
					}
				}
			}
		case <-r.quit:
			if r.player[0] != nil {
				close(r.player[0].send)
			} else if r.player[1] != nil {
				close(r.player[1].send)
			}
			r.player[0] = nil
			r.player[1] = nil
			ticker := time.NewTicker(10 * time.Second)
			for {
				select {
				case <-r.broadcast:
				case <-ticker.C:
					ticker.Stop()
					return
				}
			}
		}
	}
}

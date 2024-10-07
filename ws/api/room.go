package api

import "time"

type Room struct {
	id         int64
	name       string
	player     [2]*Client
	broadcast  chan inRoom
	register   chan *Client
	unregister chan *Client
	quit       chan struct{}
}

func createRoom(id int64, name string) *Room {
	return &Room{
		id:         id,
		name:       name,
		player:     [2]*Client{nil, nil},
		broadcast:  make(chan inRoom),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		quit:       make(chan struct{}),
	}
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.register:
			if r.player[0] == nil {
				r.player[0] = client
			} else if r.player[1] == nil {
				r.player[1] = client
			}
		case client := <-r.unregister:
			if client != nil {
				close(client.send)
			}
			r.player[1] = nil
		case message := <-r.broadcast:
			if r.player[1] == nil && r.player[0].name == message.Player {
				select {
				case r.player[0].send <- inRoom{Player: "", Ready: 0, GameState: 0, Data: ""}:
				default:
					close(r.player[0].send)
				}
			}
			for _, p := range r.player {
				if p != nil && p.name != message.Player {
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

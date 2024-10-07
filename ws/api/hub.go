package api

import "math"

type Hub struct {
	register   chan *Room
	unregister chan *Room
	rooms      map[int64]*Room
}

func NewHub() (hub *Hub) {
	return &Hub{
		register:   make(chan *Room),
		unregister: make(chan *Room),
		rooms:      make(map[int64]*Room),
	}
}

func (h *Hub) run() {
	for {
		select {
		case room := <-h.register:
			h.rooms[room.id] = room
		case room := <-h.unregister:
			if _, ok := h.rooms[room.id]; ok {
				close(room.quit)
				delete(h.rooms, room.id)
				room.id = 0
			}
		}
	}
}

func (h *Hub) unusedRoomId() int64 {
	var i int64
	for i = 1; i < math.MaxInt64; i++ {
		if _, ok := h.rooms[i]; !ok {
			return i
		}
	}
	return 0
}

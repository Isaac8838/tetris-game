package api

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/isaac8838/tetris-game-multiplayer/utils"
)

type Server struct {
	config   utils.Config
	upgrader websocket.Upgrader
	hub      *Hub
}

func NewServer(config utils.Config, upgrader websocket.Upgrader, hub *Hub) (server *Server, err error) {
	server = &Server{
		config:   config,
		upgrader: upgrader,
		hub:      hub,
	}
	err = nil

	server.setupServer()
	return
}

func (s *Server) setupServer() {
	http.HandleFunc("/lobby", s.lobby)
	http.HandleFunc("/create_room", s.createRoom)
	http.HandleFunc("/join_room", s.joinRoom)
}

func (s *Server) Start() error {
	go s.hub.run()
	log.Printf("Starting server at: %s\n", s.config.ServerAddress)
	err := http.ListenAndServe(s.config.ServerAddress, nil)
	if err != nil {
		log.Printf("Failed to ListenAndServe: %v", err)
	}
	return err
}

func NewUpgrader(config utils.Config) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			allowOrigins := []string{"http://localhost:3001", config.AccessOrigin}
			origin := r.Header.Get("Origin")
			for _, allowOrigin := range allowOrigins {
				if origin == allowOrigin {
					return true
				}
			}
			return false
		},
	}
}

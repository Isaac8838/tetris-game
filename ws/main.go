package main

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/isaac8838/tetris-game-multiplayer/api"
	"github.com/isaac8838/tetris-game-multiplayer/utils"
)

func main() {
	config, err := utils.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load config")
	}

	upgrader := api.NewUpgrader(config)

	hub := api.NewHub()

	runWS(config, upgrader, hub)
}

func runWS(config utils.Config, upgrader websocket.Upgrader, hub *api.Hub) {
	server, err := api.NewServer(config, upgrader, hub)
	if err != nil {
		log.Fatal("Failed to create server")
	}

	err = server.Start()
	if err != nil {
		log.Fatal("Falied to start server")
	}
}

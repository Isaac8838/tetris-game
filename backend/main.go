package main

import (
	"context"
	"log"

	"github.com/isaac8838/tetris-game/api"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	config, err := utils.LoadConfig(".")
	if err != nil {
		log.Fatal("Unable load config: ", err)
	}

	dbpool, err := pgxpool.New(context.Background(), config.DBSource)
	if err != nil {
		log.Fatal("Unable connect to database: ", err)
	}
	defer dbpool.Close()

	dbqtx := db.NewDBQTx(dbpool)
	helper := api.NewHelper()

	runGinServer(config, dbqtx, helper)
}

func runGinServer(config utils.Config, dbqtx db.DBQTx, helper api.Helper) {
	server, err := api.NewServer(config, dbqtx, helper)
	if err != nil {
		log.Fatal("Unable create server")
	}

	err = server.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("Unable start server")
	}
}

package main

import (
	"context"
	"log"

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

}

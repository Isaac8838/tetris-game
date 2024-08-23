package main

import (
	"context"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
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

	runDBMigration(config.MigrationURL, config.DBSource)

	dbqtx := db.NewDBQTx(dbpool)
	helper := api.NewHelper()

	runGinServer(config, dbqtx, helper)
}

func runDBMigration(migrationURL string, dbSource string) {
	migration, err := migrate.New(migrationURL, dbSource)
	if err != nil {
		log.Fatal("cannot create new migrate instance:", err)
	}

	if err = migration.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal("failed to run migrate up:", err)
	}

	log.Println("db migrated successfully")
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

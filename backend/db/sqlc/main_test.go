package db

import (
	"context"
	"log"
	"os"
	"testing"

	"github.com/isaac8838/tetris-game/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

var testDBQTx DBQTx

func TestMain(m *testing.M) {
	config, err := utils.LoadConfig("../..")
	if err != nil {
		log.Fatal("Unable load config: ", err)
	}

	dbpool, err := pgxpool.New(context.Background(), config.DBSource)
	if err != nil {
		log.Fatal("Unable connect to database: ", err)
	}

	testDBQTx = NewDBQTx(dbpool)

	os.Exit(m.Run())
}

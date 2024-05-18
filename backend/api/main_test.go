package api

import (
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/stretchr/testify/require"
)

func newTestServer(t *testing.T, dbqtx db.DBQTx) *Server {
	config := utils.Config{}
	server, err := NewServer(config, dbqtx)
	require.NoError(t, err)

	return server
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

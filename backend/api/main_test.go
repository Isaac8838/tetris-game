package api

import (
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/stretchr/testify/require"
)

func newTestServer(t *testing.T, dbqtx db.DBQTx, helper Helper) *TetrisServer {
	config := utils.Config{
		AccessTokenDuration:  time.Minute,
		RefreshTokenDuration: time.Hour,
		AccessOrigin:         "http://test.com",
	}
	server, err := NewServer(config, dbqtx, helper)
	require.NoError(t, err)

	return server
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

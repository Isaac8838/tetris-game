package api

import (
	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
	"github.com/isaac8838/tetris-game/utils"
)

type TetrisServer struct {
	config     utils.Config
	dbqtx      db.DBQTx
	router     *gin.Engine
	tokenMaker token.Maker
	helper     Helper
}

func NewServer(config utils.Config, dbqtx db.DBQTx, helper Helper) (*TetrisServer, error) {
	tokenMaker := token.NewPasetoMaker()
	server := &TetrisServer{
		config:     config,
		dbqtx:      dbqtx,
		tokenMaker: tokenMaker,
		helper:     helper,
	}

	server.SetupRouter()
	return server, nil
}

func (server *TetrisServer) SetupRouter() {
	router := gin.Default()

	router.POST("/tokens/renew_access", server.renewToken)

	server.router = router
}

func (server *TetrisServer) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}

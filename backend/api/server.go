package api

import (
	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
	"github.com/isaac8838/tetris-game/utils"
)

type Server struct {
	config     utils.Config
	dbqtx      db.DBQTx
	router     *gin.Engine
	tokenMaker token.Maker
}

func NewServer(config utils.Config, dbqtx db.DBQTx) (*Server, error) {
	tokenMaker := token.NewPasetoMaker()
	server := &Server{
		config:     config,
		dbqtx:      dbqtx,
		tokenMaker: tokenMaker,
	}

	server.setupRouter()
	return server, nil
}

func (server *Server) setupRouter() {
	router := gin.Default()

	router.POST("/tokens/renew_access", server.renewToken)

	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}

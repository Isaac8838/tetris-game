package api

import (
	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/utils"
)

type Server struct {
	config utils.Config
	dbqtx  db.DBQTx
	router *gin.Engine
}

func NewServer(config utils.Config, dbqtx db.DBQTx) (*Server, error) {
	server := &Server{
		config: config,
		dbqtx:  dbqtx,
	}

	server.setupRouter()
	return server, nil
}

func (server *Server) setupRouter() {
	router := gin.Default()

	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

/*func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}*/

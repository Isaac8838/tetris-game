package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (server *TetrisServer) healthCheck(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, "OK")
}

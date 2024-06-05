package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type listAchievementsRequest struct {
	Owner string `form:"owner" binding:"required,alphanum"`
}

func (server *TetrisServer) listAchievements(ctx *gin.Context) {
	var req listAchievementsRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	achievements, err := server.dbqtx.ListAchievements(ctx, req.Owner)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, achievements)
}

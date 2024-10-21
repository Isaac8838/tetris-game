package api

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
)

type getBalanceResponse struct {
	Owner     string    `json:"owner"`
	Balance   int64     `json:"balance"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (server *TetrisServer) getBalance(ctx *gin.Context) {

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	balance, err := server.dbqtx.GetBalance(ctx, authPayload.Username)
	if err != nil {
		if errors.Is(db.ErrRecordNotFound, err) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := getBalanceResponse{
		Owner:     balance.Owner,
		Balance:   balance.Balance.Int64,
		UpdatedAt: balance.UpdatedAt.Time,
	}

	ctx.JSON(http.StatusOK, rsp)
}

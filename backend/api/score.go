package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
	"github.com/jackc/pgx/v5/pgtype"
)

type createScoreRequest struct {
	Score int64 `json:"score" binding:"gte=0"`
	Level int32 `json:"level" binding:"required,gt=0"`
}

func (server *TetrisServer) createScore(ctx *gin.Context) {
	var req createScoreRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)
	arg := db.CreateScoreTxParams{
		CreateScoreParams: db.CreateScoreParams{
			Owner: authPayload.Username,
			Score: pgtype.Int8{
				Int64: req.Score,
				Valid: true,
			},
			Level: pgtype.Int4{
				Int32: req.Level,
				Valid: true,
			},
		},
	}

	scoreTxResult, err := server.dbqtx.CreateScoreTx(ctx, arg)
	if err != nil {
		errCode := db.ErrorCode(err)
		if errCode == db.ForeignKeyViolation || errCode == db.UniqueViolation {
			ctx.JSON(http.StatusForbidden, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	err = server.helper.CreateAchievement(ctx, scoreTxResult.Score, server.dbqtx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
	}

	ctx.JSON(http.StatusOK, scoreTxResult.Score)
}

type listScoreRequest struct {
	Owner    string `form:"owner" binding:"required,alphanum"`
	PageID   int32  `form:"page_id" binding:"required,min=1"`
	PageSize int32  `form:"page_size" binding:"required,min=5,max=10"`
}

func (server *TetrisServer) listScores(ctx *gin.Context) {
	var req listScoreRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListScoresParams{
		Owner:  req.Owner,
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}

	scores, err := server.dbqtx.ListScores(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, scores)
}

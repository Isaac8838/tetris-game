package api

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/jackc/pgx/v5/pgtype"
)

type getDefaultSkinResponse struct {
	SkinID int32 `json:"skin_id"`
}

func (server *TetrisServer) getDefaultSkin(ctx *gin.Context) {
	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	defaultSkin, err := server.dbqtx.GetDefaultSkin(ctx, authPayload.Username)
	if err != nil {
		if errors.Is(db.ErrRecordNotFound, err) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := getDefaultSkinResponse{
		SkinID: defaultSkin.SkinID,
	}

	ctx.JSON(http.StatusOK, rsp)
}

type purchaseSkinRequest struct {
	Amount int64 `json:"amount" binding:"required"`
	SkinID int32 `json:"skin_id" binding:"min=0"`
}

type purchaseSkinResponse struct {
	Balance int64 `json:"balance"`
	SkinID  int32 `json:"skin_id"`
}

func (server *TetrisServer) purchaseSkin(ctx *gin.Context) {
	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req purchaseSkinRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	balance, err := server.dbqtx.GetBalance(ctx, authPayload.Username)
	if err != nil {
		if errors.Is(db.ErrRecordNotFound, err) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if int(req.Amount) != utils.Skins[int(req.SkinID)] {
		err := errors.New("skin amount doesn't fit")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	balance.Balance.Int64 -= req.Amount

	if balance.Balance.Int64 < 0 {
		err := errors.New("user has insufficient balance")
		ctx.JSON(http.StatusForbidden, errorResponse(err))
		return
	}

	argCreateSkin := db.CreateSkinTxParams{
		CreateSkinParams: db.CreateSkinParams{
			Owner:       balance.Owner,
			SkinID:      req.SkinID,
			DefaultSkin: false,
		},
	}

	skin, err := server.dbqtx.CreateSkinTx(ctx, argCreateSkin)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
	}

	argUpdatedBalance := db.UpdateBalanceTxParams{
		UpdateBalanceParams: db.UpdateBalanceParams{
			Balance: balance.Balance,
			UpdatedAt: pgtype.Timestamptz{
				Time:  time.Now(),
				Valid: true,
			},
			Owner: balance.Owner,
		},
	}

	newBalance, err := server.dbqtx.UpdateBalanceTx(ctx, argUpdatedBalance)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := purchaseSkinResponse{
		Balance: newBalance.Balance.Balance.Int64,
		SkinID:  skin.Skin.SkinID,
	}

	ctx.JSON(http.StatusOK, rsp)
}

type setDefaultSkinRequest struct {
	SkinID int32 `json:"skin_id" binding:"min=0"`
}

type setDefaultSkinResponse struct {
	SkinID int32 `json:"skin_id"`
}

func (server *TetrisServer) setDefaultSkin(ctx *gin.Context) {
	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req setDefaultSkinRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	defaultSkin, err := server.dbqtx.GetDefaultSkin(ctx, authPayload.Username)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	argUpdateDefaultSkin := db.UpdateSkinTxParams{
		UpdateSkinParams: db.UpdateSkinParams{
			Owner:       defaultSkin.Owner,
			SkinID:      defaultSkin.SkinID,
			DefaultSkin: false,
		},
	}

	_, err = server.dbqtx.UpdateSkinTx(ctx, argUpdateDefaultSkin)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	argUpdatedSkin := db.UpdateSkinTxParams{
		UpdateSkinParams: db.UpdateSkinParams{
			Owner:       authPayload.Username,
			SkinID:      req.SkinID,
			DefaultSkin: true,
		},
	}

	updatedSkin, err := server.dbqtx.UpdateSkinTx(ctx, argUpdatedSkin)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := setDefaultSkinResponse{
		SkinID: updatedSkin.Skin.SkinID,
	}

	ctx.JSON(http.StatusOK, rsp)
}

func (server *TetrisServer) listSkins(ctx *gin.Context) {
	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	skins, err := server.dbqtx.ListSkins(ctx, authPayload.Username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, skins)
}

type listSkinPricesResponse struct {
	SkinID int32 `json:"skin_id"`
	Price  int64 `json:"price"`
}

func (server *TetrisServer) listSkinPrices(ctx *gin.Context) {
	var rsp []listSkinPricesResponse
	for i := 0; i < utils.SkinAmount; i++ {
		rsp = append(rsp, listSkinPricesResponse{
			SkinID: int32(i),
			Price:  int64(utils.Skins[i]),
		})
	}

	ctx.JSON(http.StatusOK, rsp)
}

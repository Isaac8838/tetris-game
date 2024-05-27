package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type renewTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type renewTokenResponse struct {
	AccessToken           string    `json:"access_token"`
	AccessTokenExpiresAt  time.Time `json:"access_token_expires_at"`
	RefreshToken          string    `json:"refresh_token"`
	RefreshTokenExpiresAt time.Time `json:"refresh_token_expires_at"`
}

// The refresh tokens that were used
var validUsedRefreshToken = make(map[string]time.Time)

// using refresh token rotation to renew token
func (server *TetrisServer) renewToken(ctx *gin.Context) {
	var req renewTokenRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	err := server.helper.DetectedRefreshTokenReused(req.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	refreshTokenPayload, err := server.tokenMaker.VerifyToken(req.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	if time.Now().After(refreshTokenPayload.ExpiredAt) {
		err := fmt.Errorf("refresh token expired")
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(
		refreshTokenPayload.Username,
		server.config.AccessTokenDuration,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// store used refresh token
	validUsedRefreshToken[req.RefreshToken] = refreshTokenPayload.ExpiredAt
	deleteExpiredRefreshTokens()

	newRefreshToken, newRefreshTokenPayload, err := server.tokenMaker.CreateToken(
		refreshTokenPayload.Username,
		server.config.RefreshTokenDuration,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := renewTokenResponse{
		AccessToken:           accessToken,
		AccessTokenExpiresAt:  accessPayload.ExpiredAt,
		RefreshToken:          newRefreshToken,
		RefreshTokenExpiresAt: newRefreshTokenPayload.ExpiredAt,
	}
	ctx.JSON(http.StatusOK, rsp)
}

func deleteExpiredRefreshTokens() {
	for token, expiredAt := range validUsedRefreshToken {
		if time.Now().After(expiredAt) {
			delete(validUsedRefreshToken, token)
		}
	}
}

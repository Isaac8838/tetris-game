package api

import "fmt"

type Helper interface {
	DetectedRefreshTokenReused(refreshToken string) error
}

type FuncHelper struct {
}

func NewHelper() Helper {
	return &FuncHelper{}
}

func (helper *FuncHelper) DetectedRefreshTokenReused(refreshToken string) error {
	_, ok := validUsedRefreshToken[refreshToken]
	if ok {
		// clear all the refresh tokens
		for token := range validUsedRefreshToken {
			delete(validUsedRefreshToken, token)
		}

		return fmt.Errorf("refresh token is reused, user might be hacked")
	}
	return nil
}

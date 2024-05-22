package api

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func NewFuncHelper(t *testing.T) Helper {
	helper := NewHelper()
	require.Equal(t, &FuncHelper{}, helper)
	return helper
}

func TestDeleteRefreshTokenReused(t *testing.T) {
	token := "1234"
	helper := NewFuncHelper(t).(*FuncHelper)

	err := helper.DetectedRefreshTokenReused(token)
	require.NoError(t, err)

	validUsedRefreshToken[token] = time.Now().Add(time.Hour)
	err = helper.DetectedRefreshTokenReused(token)
	require.Error(t, err)

	err = helper.DetectedRefreshTokenReused(token)
	require.NoError(t, err)
}

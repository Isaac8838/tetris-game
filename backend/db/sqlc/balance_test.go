package db

import (
	"context"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/require"
)

func TestCreateBalance(t *testing.T) {
	user := createRandomUser(t)
	require.NotEmpty(t, user)
	balance := createRandomBalance(t, user.Username)
	require.NotEmpty(t, balance)
}

func TestGetBalance(t *testing.T) {
	user := createRandomUser(t)
	require.NotEmpty(t, user)
	balance := createRandomBalance(t, user.Username)
	require.NotEmpty(t, balance)

	getBalance, err := testDBQTx.GetBalance(context.Background(), user.Username)
	require.NoError(t, err)
	require.NotEmpty(t, getBalance)
	require.Equal(t, balance.Owner, getBalance.Owner)
	require.Equal(t, balance.Balance, getBalance.Balance)
	require.WithinDuration(t, balance.CreatedAt.Time, getBalance.CreatedAt.Time, time.Second)
	require.WithinDuration(t, balance.UpdatedAt.Time, getBalance.UpdatedAt.Time, time.Second)
}

func TestUpdateBalance(t *testing.T) {
	user := createRandomUser(t)
	require.NotEmpty(t, user)
	balance := createRandomBalance(t, user.Username)
	require.NotEmpty(t, balance)

	arg := UpdateBalanceParams{
		Balance: pgtype.Int8{
			Int64: balance.Balance.Int64 - int64(50),
			Valid: true,
		},
		UpdatedAt: pgtype.Timestamptz{
			Time:  time.Now(),
			Valid: true,
		},
		Owner: user.Username,
	}

	updatedBalance, err := testDBQTx.UpdateBalance(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, updatedBalance)
	require.Equal(t, balance.Owner, updatedBalance.Owner)
	require.Equal(t, balance.Balance.Int64-int64(50), updatedBalance.Balance.Int64)
	require.WithinDuration(t, balance.CreatedAt.Time, updatedBalance.CreatedAt.Time, time.Second)
	require.NotEqual(t, balance.UpdatedAt.Time, updatedBalance.UpdatedAt)
}

func createRandomBalance(t *testing.T, owner string) Balance {
	arg := CreateBalanceParams{
		Owner: owner,
		Balance: pgtype.Int8{
			Int64: 200,
			Valid: true,
		},
	}

	balance, err := testDBQTx.CreateBalance(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, balance)

	return balance
}

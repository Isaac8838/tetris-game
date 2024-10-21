package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Defining all functions to execute db queries and transactions
type DBQTx interface {
	Querier
	CreateUserTx(ctx context.Context, arg CreateUserTxParams) (CreateUserTxResult, error)
	CreateScoreTx(ctx context.Context, arg CreateScoreTxParams) (CreateScoreTxResult, error)
	CreateAchievementTx(ctx context.Context, arg CreateAchievementTxParams) (CreateAchievementTxResult, error)
	CreateBalanceTx(ctx context.Context, arg CreateBalanceTxParams) (CreateBalanceTxResult, error)
	UpdateBalanceTx(ctx context.Context, arg UpdateBalanceTxParams) (UpdateBalanceTxResult, error)
	CreateSkinTx(ctx context.Context, arg CreateSkinTxParams) (CreateSkinTxResult, error)
	UpdateSkinTx(ctx context.Context, arg UpdateSkinTxParams) (UpdateSkinTxResult, error)
}

type SQLDBQTx struct {
	dbpool *pgxpool.Pool
	*Queries
}

func NewDBQTx(dbpool *pgxpool.Pool) DBQTx {
	return &SQLDBQTx{
		dbpool:  dbpool,
		Queries: New(dbpool),
	}
}

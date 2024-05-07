package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Defining all functions to execute db queries and transactions
type DBQTx interface {
	Querier
	CreateUserTx(ctx context.Context, arg CreateUserTxParams) (CreateUserTxResult, error)
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

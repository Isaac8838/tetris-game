package db

import (
	"context"
	"fmt"
)

func (dbqtx *SQLDBQTx) execTx(ctx context.Context, fn func(*Queries) error) error {
	tx, err := dbqtx.dbpool.Begin(ctx)
	if err != nil {
		return err
	}

	q := New(tx)
	err = fn(q)
	if err != nil {
		if rollbackErr := tx.Rollback(ctx); rollbackErr != nil {
			return fmt.Errorf("transaction error: %v, rollback error: %v", err, rollbackErr)
		}
		return err
	}

	return tx.Commit(ctx)
}

package db

import "context"

type CreateBalanceTxParams struct {
	CreateBalanceParams
}

type CreateBalanceTxResult struct {
	Balance Balance
}

func (dbqtx *SQLDBQTx) CreateBalanceTx(ctx context.Context, arg CreateBalanceTxParams) (CreateBalanceTxResult, error) {
	var result CreateBalanceTxResult

	err := dbqtx.execTx(ctx, func(q *Queries) error {
		var err error

		result.Balance, err = dbqtx.CreateBalance(ctx, arg.CreateBalanceParams)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

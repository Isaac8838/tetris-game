package db

import "context"

type UpdateBalanceTxParams struct {
	UpdateBalanceParams
}

type UpdateBalanceTxResult struct {
	Balance Balance
}

func (dbqtx *SQLDBQTx) UpdateBalanceTx(ctx context.Context, arg UpdateBalanceTxParams) (UpdateBalanceTxResult, error) {
	var result UpdateBalanceTxResult

	err := dbqtx.execTx(ctx, func(q *Queries) error {
		var err error
		result.Balance, err = dbqtx.UpdateBalance(ctx, arg.UpdateBalanceParams)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

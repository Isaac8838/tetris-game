package db

import "context"

type CreateUserTxParams struct {
	CreateUserParams
}

type CreateUserTxResult struct {
	User User
}

func (dbqtx *SQLDBQTx) CreateUserTx(ctx context.Context, arg CreateUserTxParams) (CreateUserTxResult, error) {
	var result CreateUserTxResult

	err := dbqtx.execTx(ctx, func(q *Queries) error {
		var err error

		result.User, err = q.CreateUser(ctx, arg.CreateUserParams)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

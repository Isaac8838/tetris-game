package db

import "context"

type CreateScoreTxParams struct {
	CreateScoreParams
}

type CreateScoreTxResult struct {
	Score Score
}

func (dbqtx *SQLDBQTx) CreateScoreTx(ctx context.Context, arg CreateScoreTxParams) (CreateScoreTxResult, error) {
	var result CreateScoreTxResult

	err := dbqtx.execTx(ctx, func(q *Queries) error {
		var err error

		result.Score, err = q.CreateScore(ctx, arg.CreateScoreParams)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

package db

import "context"

type CreateAchievementTxParams struct {
	CreateAchievementParams
}

type CreateAchievementTxResult struct {
	Achievement
}

func (dbqtx *SQLDBQTx) CreateAchievementTx(ctx context.Context, arg CreateAchievementTxParams) (CreateAchievementTxResult, error) {
	var result CreateAchievementTxResult

	err := dbqtx.execTx(ctx, func(q *Queries) error {
		var err error

		result.Achievement, err = dbqtx.CreateAchievement(ctx, arg.CreateAchievementParams)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

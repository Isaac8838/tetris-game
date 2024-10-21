package db

import "context"

type CreateSkinTxParams struct {
	CreateSkinParams
}

type CreateSkinTxResult struct {
	Skin Skin
}

func (dbqtx *SQLDBQTx) CreateSkinTx(ctx context.Context, arg CreateSkinTxParams) (CreateSkinTxResult, error) {
	var result CreateSkinTxResult

	err := dbqtx.execTx(ctx, func(q *Queries) error {
		var err error

		result.Skin, err = dbqtx.CreateSkin(ctx, arg.CreateSkinParams)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

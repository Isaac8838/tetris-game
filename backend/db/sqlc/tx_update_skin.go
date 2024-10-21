package db

import "context"

type UpdateSkinTxParams struct {
	UpdateSkinParams
}

type UpdateSkinTxResult struct {
	Skin Skin
}

func (dbqtx *SQLDBQTx) UpdateSkinTx(ctx context.Context, arg UpdateSkinTxParams) (UpdateSkinTxResult, error) {
	var result UpdateSkinTxResult

	err := dbqtx.execTx(ctx, func(q *Queries) error {
		var err error

		result.Skin, err = dbqtx.UpdateSkin(ctx, arg.UpdateSkinParams)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

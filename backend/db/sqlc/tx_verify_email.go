package db

import "context"

// TBD
type VerifyEmailTxParams struct {
}

// TBD
type VerifyEmailTxResult struct {
}

// TBD
func (dbqtx *SQLDBQTx) VerifyEmailTx(ctx context.Context, arg VerifyEmailTxParams) (VerifyEmailTxResult, error) {
	var result VerifyEmailTxResult
	var err error

	return result, err
}

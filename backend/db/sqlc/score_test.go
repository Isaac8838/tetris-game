package db

import (
	"context"
	"testing"

	"github.com/isaac8838/tetris-game/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/require"
)

func createRandomScore(t *testing.T) Score {
	owner := createRandomUser(t)
	point := utils.CreateRandomNumber(1, 1000)
	level := utils.CreateRandomNumber(1, 100)

	arg := CreateScoreParams{
		Owner: owner.Username,
		Score: pgtype.Int8{
			Int64: point,
			Valid: true,
		},
		Level: pgtype.Int4{
			Int32: int32(level),
			Valid: true,
		},
	}

	score, err := testDBQTx.CreateScore(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, score)
	require.Equal(t, score.Owner, arg.Owner)
	require.Equal(t, score.Score, arg.Score)
	require.Equal(t, score.Level, arg.Level)
	require.NotZero(t, score.ID)
	require.NotZero(t, score.CreatedAt)

	return score
}

func TestCreateScore(t *testing.T) {
	createRandomScore(t)
}

func TestListScores(t *testing.T) {
	var lastScore Score
	for i := 0; i < 10; i++ {
		lastScore = createRandomScore(t)
	}

	arg := ListScoresParams{
		Owner:  lastScore.Owner,
		Limit:  5,
		Offset: 0,
	}

	scores, err := testDBQTx.ListScores(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, scores)

	for _, score := range scores {
		require.NotEmpty(t, score)
		require.Equal(t, lastScore.Owner, score.Owner)
	}
}

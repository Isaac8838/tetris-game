package db

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestRankByScore(t *testing.T) {
	n := 10
	limit := 5
	for i := 0; i < n; i++ {
		createRandomScore(t)
	}

	arg := RankByScoreParams{
		Limit:  int32(limit),
		Offset: 0,
	}

	scores, err := testDBQTx.RankByScore(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, scores)

	count := 0
	for i := range scores {
		if i+1 < limit {
			require.NotEmpty(t, scores[i])
			require.NotEmpty(t, scores[i+1])
			require.Condition(t, func() bool {
				return scores[i].Score.Int64 >= scores[i+1].Score.Int64
			})
		}
		count++
	}
	require.Equal(t, count, limit)
}

func TestRankByLevel(t *testing.T) {
	n := 10
	limit := 5
	for i := 0; i < n; i++ {
		createRandomScore(t)
	}

	arg := RankByLevelParams{
		Limit:  int32(limit),
		Offset: 0,
	}

	scores, err := testDBQTx.RankByLevel(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, scores)

	count := 0
	for i := range scores {
		if i+1 < limit {
			require.NotEmpty(t, scores[i])
			require.NotEmpty(t, scores[i+1])
			require.Condition(t, func() bool {
				return int64(scores[i].Level.Int32) >= int64(scores[i+1].Level.Int32)
			})
		}
		count++
	}
	require.Equal(t, count, limit)
}

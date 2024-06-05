package db

import (
	"context"
	"testing"
	"time"

	"github.com/isaac8838/tetris-game/utils"
	"github.com/stretchr/testify/require"
)

func randomAchievement(t *testing.T, owner string, id int32) Achievement {
	arg := CreateAchievementParams{
		Owner:         owner,
		AchievementID: id,
	}

	achievement, err := testDBQTx.CreateAchievement(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, achievement)

	require.Equal(t, achievement.Owner, arg.Owner)
	require.Equal(t, achievement.AchievementID, arg.AchievementID)
	require.NotZero(t, achievement.AchievedAt)

	return achievement
}

func TestCreateAchievement(t *testing.T) {
	user := createRandomUser(t)
	achievementID := int32(utils.CreateRandomNumber(1, 10))
	randomAchievement(t, user.Username, achievementID)
}

func TestListAchievements(t *testing.T) {
	var lastAchievement Achievement
	for i := 0; i < 5; i++ {
		user := createRandomUser(t)
		achievementID := int32(utils.CreateRandomNumber(1, 10))
		lastAchievement = randomAchievement(t, user.Username, achievementID)
	}

	achievements, err := testDBQTx.ListAchievements(context.Background(), lastAchievement.Owner)
	require.NoError(t, err)
	require.NotEmpty(t, achievements)

	for _, achievement := range achievements {
		require.NotEmpty(t, achievement)
		require.Equal(t, achievement.Owner, lastAchievement.Owner)
	}
}

func TestGetScoreAchievement(t *testing.T) {
	user := createRandomUser(t)
	achi0 := randomAchievement(t, user.Username, 1)
	achi1 := randomAchievement(t, user.Username, 5)
	require.Greater(t, achi1.AchievementID, achi0.AchievementID)

	arg := GetAchievementParams{
		Owner:           user.Username,
		AchievementID:   utils.ScoreOffset,
		AchievementID_2: utils.ScoreRange,
	}

	achi2, err := testDBQTx.GetAchievement(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, achi2)
	require.Equal(t, achi1.Owner, achi2.Owner)
	require.Equal(t, achi1.AchievementID, achi2.AchievementID)
	require.WithinDuration(t, achi1.AchievedAt.Time, achi2.AchievedAt.Time, time.Second)
	require.Greater(t, achi2.AchievementID, achi0.AchievementID)
}

func TestGetLevelAchievement(t *testing.T) {
	user := createRandomUser(t)
	achi0 := randomAchievement(t, user.Username, 6)
	achi1 := randomAchievement(t, user.Username, 10)
	require.Greater(t, achi1.AchievementID, achi0.AchievementID)

	arg := GetAchievementParams{
		Owner:           user.Username,
		AchievementID:   utils.LevelOffset,
		AchievementID_2: utils.LevelRange,
	}

	achi2, err := testDBQTx.GetAchievement(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, achi2)
	require.Equal(t, achi1.Owner, achi2.Owner)
	require.Equal(t, achi1.AchievementID, achi2.AchievementID)
	require.WithinDuration(t, achi1.AchievedAt.Time, achi2.AchievedAt.Time, time.Second)
	require.Greater(t, achi2.AchievementID, achi0.AchievementID)

	user = createRandomUser(t)
	achi3, err := testDBQTx.GetAchievement(context.Background(), GetAchievementParams{})
	require.EqualError(t, err, ErrRecordNotFound.Error())
	require.Empty(t, achi3)
}

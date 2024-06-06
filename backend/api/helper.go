package api

import (
	"context"
	"errors"
	"fmt"

	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/utils"
)

type Helper interface {
	DetectedRefreshTokenReused(refreshToken string) error
	CreateAchievement(ctx context.Context, score db.Score, dbqtx db.DBQTx) error
}

type FuncHelper struct {
}

func NewHelper() Helper {
	return &FuncHelper{}
}

func (helper *FuncHelper) DetectedRefreshTokenReused(refreshToken string) error {
	_, ok := validUsedRefreshToken[refreshToken]
	if ok {
		// clear all the refresh tokens
		for token := range validUsedRefreshToken {
			delete(validUsedRefreshToken, token)
		}

		return fmt.Errorf("refresh token is reused, user might be hacked")
	}
	return nil
}

func (helper *FuncHelper) CreateAchievement(ctx context.Context, score db.Score, dbqtx db.DBQTx) error {
	arg := db.GetAchievementParams{
		Owner:           score.Owner,
		AchievementID:   utils.ScoreOffset,
		AchievementID_2: utils.ScoreRange,
	}
	scoreAchi, err := dbqtx.GetAchievement(ctx, arg)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			scoreAchi.AchievementID = 0
		} else {
			return err
		}
	}

	arg = db.GetAchievementParams{
		Owner:           score.Owner,
		AchievementID:   utils.LevelOffset,
		AchievementID_2: utils.LevelRange,
	}
	levelAchi, err := dbqtx.GetAchievement(ctx, arg)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			levelAchi.AchievementID = 0
		} else {
			return err
		}
	}

	currentHighestScore := utils.Achievements[scoreAchi.AchievementID]
	currentHighestLevel := utils.Achievements[levelAchi.AchievementID]

	if score.Score.Int64 > currentHighestScore {
		var i int32
		offset := 1
		if scoreAchi.AchievementID == 0 {
			offset = utils.ScoreOffset
		}
		for i = scoreAchi.AchievementID + int32(offset); i <= utils.ScoreRange; i++ {
			achiScore := utils.Achievements[i]
			if score.Score.Int64 < achiScore {
				break
			} else {
				arg := db.CreateAchievementTxParams{
					CreateAchievementParams: db.CreateAchievementParams{
						Owner:         score.Owner,
						AchievementID: i,
					},
				}
				_, err := dbqtx.CreateAchievementTx(ctx, arg)
				if err != nil {
					return err
				}
			}
		}
	}

	if int64(score.Level.Int32) > currentHighestLevel {
		var i int32
		offset := 1
		if levelAchi.AchievementID == 0 {
			offset = utils.LevelOffset
		}
		for i = levelAchi.AchievementID + int32(offset); i <= utils.LevelRange; i++ {
			achiLevel := int32(utils.Achievements[i])
			if score.Level.Int32 < achiLevel {
				break
			} else {
				arg := db.CreateAchievementTxParams{
					CreateAchievementParams: db.CreateAchievementParams{
						Owner:         score.Owner,
						AchievementID: i,
					},
				}
				_, err := dbqtx.CreateAchievementTx(ctx, arg)
				if err != nil {
					return err
				}
			}
		}
	}

	return nil
}

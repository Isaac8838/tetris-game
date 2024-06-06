package api

import (
	"context"
	"database/sql"
	"testing"
	"time"

	mockdb "github.com/isaac8838/tetris-game/db/mock"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
)

func newTestFuncHelper(t *testing.T) Helper {
	helper := NewHelper()
	require.Equal(t, &FuncHelper{}, helper)
	return helper
}

func TestDeleteRefreshTokenReused(t *testing.T) {
	token := "1234"
	helper := newTestFuncHelper(t).(*FuncHelper)

	err := helper.DetectedRefreshTokenReused(token)
	require.NoError(t, err)

	validUsedRefreshToken[token] = time.Now().Add(time.Hour)
	err = helper.DetectedRefreshTokenReused(token)
	require.Error(t, err)

	err = helper.DetectedRefreshTokenReused(token)
	require.NoError(t, err)
}

func TestCreateAchievement(t *testing.T) {
	user, _ := randomUser(t)
	testCases := []struct {
		name       string
		score      db.Score
		buildStubs func(dbqtx *mockdb.MockDBQTx)
		checkError func(err error)
	}{
		{
			name: "OK",
			score: db.Score{
				Owner: user.Username,
				Score: pgtype.Int8{
					Int64: 10,
					Valid: true,
				},
				Level: pgtype.Int4{
					Int32: 5,
					Valid: true,
				},
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg1 := db.GetAchievementParams{
					Owner:           user.Username,
					AchievementID:   utils.ScoreOffset,
					AchievementID_2: utils.ScoreRange,
				}
				arg2 := db.GetAchievementParams{
					Owner:           user.Username,
					AchievementID:   utils.LevelOffset,
					AchievementID_2: utils.LevelRange,
				}
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Eq(arg1)).
					Times(1).
					Return(db.Achievement{}, db.ErrRecordNotFound)
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Eq(arg2)).
					Times(1).
					Return(db.Achievement{}, db.ErrRecordNotFound)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.CreateAchievementTxResult{}, nil)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.CreateAchievementTxResult{}, nil)

			},
			checkError: func(err error) {
				require.NoError(t, err)
			},
		},
		{
			name: "GetInternalError",
			score: db.Score{
				Owner: user.Username,
				Score: pgtype.Int8{
					Int64: 10,
					Valid: true,
				},
				Level: pgtype.Int4{
					Int32: 5,
					Valid: true,
				},
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.Achievement{}, sql.ErrConnDone)
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(0)

			},
			checkError: func(err error) {
				require.Error(t, err)
			},
		},
		{
			name: "CreateInternalError",
			score: db.Score{
				Owner: user.Username,
				Score: pgtype.Int8{
					Int64: 10,
					Valid: true,
				},
				Level: pgtype.Int4{
					Int32: 5,
					Valid: true,
				},
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.Achievement{}, nil)
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.Achievement{}, nil)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.CreateAchievementTxResult{}, sql.ErrConnDone)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(0)

			},
			checkError: func(err error) {
				require.Error(t, err)
			},
		},
		{
			name: "OK",
			score: db.Score{
				Owner: user.Username,
				Score: pgtype.Int8{
					Int64: 10000,
					Valid: true,
				},
				Level: pgtype.Int4{
					Int32: 20,
					Valid: true,
				},
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg1 := db.GetAchievementParams{
					Owner:           user.Username,
					AchievementID:   utils.ScoreOffset,
					AchievementID_2: utils.ScoreRange,
				}
				arg2 := db.GetAchievementParams{
					Owner:           user.Username,
					AchievementID:   utils.LevelOffset,
					AchievementID_2: utils.LevelRange,
				}
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Eq(arg1)).
					Times(1).
					Return(db.Achievement{
						Owner:         user.Username,
						AchievementID: utils.Score10,
					}, nil)
				dbqtx.EXPECT().
					GetAchievement(gomock.Any(), gomock.Eq(arg2)).
					Times(1).
					Return(db.Achievement{
						Owner:         user.Username,
						AchievementID: utils.Level5,
					}, nil)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(3).
					Return(db.CreateAchievementTxResult{}, nil)
				dbqtx.EXPECT().
					CreateAchievementTx(gomock.Any(), gomock.Any()).
					Times(3).
					Return(db.CreateAchievementTxResult{}, nil)
			},
			checkError: func(err error) {
				require.NoError(t, err)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			dbqtx := mockdb.NewMockDBQTx(ctrl)
			tc.buildStubs(dbqtx)

			helper := newTestFuncHelper(t)
			err := helper.CreateAchievement(context.Background(), tc.score, dbqtx)
			tc.checkError(err)
		})
	}
}

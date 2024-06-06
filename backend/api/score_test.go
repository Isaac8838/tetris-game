package api

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	mockapi "github.com/isaac8838/tetris-game/api/mock"
	mockdb "github.com/isaac8838/tetris-game/db/mock"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
)

func TestCreateScore(t *testing.T) {
	user, _ := randomUser(t)
	score := randomScore(user.Username)

	testCases := []struct {
		name          string
		body          gin.H
		setupAuth     func(t *testing.T, request *http.Request, tokenMaker token.Maker)
		buildStubs    func(dbqtx *mockdb.MockDBQTx, helper *mockapi.MockHelper)
		checkResponse func(recorder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			body: gin.H{
				"score": score.Score,
				"level": score.Level,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx, helper *mockapi.MockHelper) {
				arg := db.CreateScoreTxParams{
					CreateScoreParams: db.CreateScoreParams{
						Owner: user.Username,
						Score: score.Score,
						Level: score.Level,
					},
				}
				dbqtx.EXPECT().
					CreateScoreTx(gomock.Any(), gomock.Eq(arg)).
					Times(1).
					Return(db.CreateScoreTxResult{Score: score}, nil)

				helper.EXPECT().
					CreateAchievement(gomock.Any(), gomock.Eq(score), gomock.Any()).
					Times(1).
					Return(nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
				requireBodyMatchScore(t, recorder.Body, score)
			},
		},
		{
			name: "NoAuthorization",
			body: gin.H{
				"score": score.Score,
				"level": score.Level,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx, helper *mockapi.MockHelper) {
				dbqtx.EXPECT().
					CreateScoreTx(gomock.Any(), gomock.Any()).
					Times(0)
				helper.EXPECT().
					CreateAchievement(gomock.Any(), gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "InternalError",
			body: gin.H{
				"score": score.Score,
				"level": score.Level,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, score.Owner, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx, helper *mockapi.MockHelper) {
				dbqtx.EXPECT().
					CreateScoreTx(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.CreateScoreTxResult{}, sql.ErrConnDone)
				helper.EXPECT().
					CreateAchievement(gomock.Any(), gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
		{
			name: "DuplicateID",
			body: gin.H{
				"score": score.Score,
				"level": score.Level,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, score.Owner, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx, helper *mockapi.MockHelper) {
				dbqtx.EXPECT().
					CreateScoreTx(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.CreateScoreTxResult{}, db.ErrUniqueViolation)
				helper.EXPECT().
					CreateAchievement(gomock.Any(), gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusForbidden, recorder.Code)
			},
		},
		{
			name: "InvalidScore",
			body: gin.H{
				"score": -1,
				"level": -1,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, score.Owner, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx, helper *mockapi.MockHelper) {
				dbqtx.EXPECT().
					CreateScoreTx(gomock.Any(), gomock.Any()).
					Times(0)
				helper.EXPECT().
					CreateAchievement(gomock.Any(), gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "CreateAchievementError",
			body: gin.H{
				"score": score.Score,
				"level": score.Level,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, score.Owner, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx, helper *mockapi.MockHelper) {
				arg := db.CreateScoreTxParams{
					CreateScoreParams: db.CreateScoreParams{
						Owner: user.Username,
						Score: score.Score,
						Level: score.Level,
					},
				}
				dbqtx.EXPECT().
					CreateScoreTx(gomock.Any(), gomock.Eq(arg)).
					Times(1).
					Return(db.CreateScoreTxResult{Score: score}, nil)
				helper.EXPECT().
					CreateAchievement(gomock.Any(), gomock.Eq(score), gomock.Any()).
					Times(1).
					Return(sql.ErrConnDone)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			dbqtx := mockdb.NewMockDBQTx(ctrl)
			helper := mockapi.NewMockHelper(ctrl)
			tc.buildStubs(dbqtx, helper)

			server := newTestServer(t, dbqtx, helper)
			recorder := httptest.NewRecorder()

			data, err := json.Marshal(tc.body)
			require.NoError(t, err)
			require.NotEmpty(t, data)

			url := "/scores"
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)

			tc.setupAuth(t, request, server.tokenMaker)
			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func TestListScores(t *testing.T) {
	user, _ := randomUser(t)

	n := 5
	scores := make([]db.Score, n)
	for i := 0; i < n; i++ {
		scores[i] = randomScore(user.Username)
	}

	type Query struct {
		owner    string
		pageID   int
		pageSize int
	}

	testCases := []struct {
		name          string
		query         Query
		buildStubs    func(dbqtx *mockdb.MockDBQTx)
		checkResponse func(recorder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			query: Query{
				owner:    user.Username,
				pageID:   1,
				pageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.ListScoresParams{
					Owner:  user.Username,
					Limit:  int32(n),
					Offset: 0,
				}

				dbqtx.EXPECT().
					ListScores(gomock.Any(), gomock.Eq(arg)).
					Times(1).
					Return(scores, nil)

			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
				requireBodyMatchScores(t, recorder.Body, scores)
			},
		},
		{
			name: "InternalError",
			query: Query{
				owner:    user.Username,
				pageID:   1,
				pageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.ListScoresParams{
					Owner:  user.Username,
					Limit:  int32(n),
					Offset: 0,
				}

				dbqtx.EXPECT().
					ListScores(gomock.Any(), gomock.Eq(arg)).
					Times(1).
					Return([]db.Score{}, sql.ErrConnDone)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
		{
			name: "InvalidPageID",
			query: Query{
				owner:    user.Username,
				pageID:   -1,
				pageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.ListScoresParams{
					Owner:  user.Username,
					Limit:  int32(n),
					Offset: 0,
				}

				dbqtx.EXPECT().
					ListScores(gomock.Any(), gomock.Eq(arg)).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InvalidPageSize",
			query: Query{
				owner:    user.Username,
				pageID:   1,
				pageSize: 100000,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.ListScoresParams{
					Owner:  user.Username,
					Limit:  int32(n),
					Offset: 0,
				}

				dbqtx.EXPECT().
					ListScores(gomock.Any(), gomock.Eq(arg)).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InvalidUsername",
			query: Query{
				owner:    "-",
				pageID:   1,
				pageSize: 100000,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.ListScoresParams{
					Owner:  user.Username,
					Limit:  int32(n),
					Offset: 0,
				}

				dbqtx.EXPECT().
					ListScores(gomock.Any(), gomock.Eq(arg)).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			dbqtx := mockdb.NewMockDBQTx(ctrl)
			tc.buildStubs(dbqtx)

			server := newTestServer(t, dbqtx, nil)
			recorder := httptest.NewRecorder()

			url := "/scores"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			q := request.URL.Query()
			q.Add("owner", tc.query.owner)
			q.Add("page_id", fmt.Sprintf("%d", tc.query.pageID))
			q.Add("page_size", fmt.Sprintf("%d", tc.query.pageSize))
			request.URL.RawQuery = q.Encode()

			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func randomScore(owner string) db.Score {
	score := utils.CreateRandomNumber(100, 1000)
	level := utils.CreateRandomNumber(1, 100)

	dbscore := db.Score{
		ID:    utils.CreateRandomNumber(1, 1000),
		Owner: owner,
		Score: pgtype.Int8{
			Int64: score,
			Valid: true,
		},
		Level: pgtype.Int4{
			Int32: int32(level),
			Valid: true,
		},
	}
	return dbscore
}

func requireBodyMatchScore(t *testing.T, body *bytes.Buffer, score db.Score) {
	data, err := io.ReadAll(body)
	require.NoError(t, err)

	var gotScore db.Score
	err = json.Unmarshal(data, &gotScore)
	require.NoError(t, err)
	require.Equal(t, score, gotScore)
}

func requireBodyMatchScores(t *testing.T, body *bytes.Buffer, scores []db.Score) {
	data, err := io.ReadAll(body)
	require.NoError(t, err)
	require.NotEmpty(t, data)

	var gotScores []db.Score
	err = json.Unmarshal(data, &gotScores)
	require.NoError(t, err)
	require.Equal(t, scores, gotScores)
}

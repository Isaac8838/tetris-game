package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	mockdb "github.com/isaac8838/tetris-game/db/mock"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
)

func TestRankByScore(t *testing.T) {
	user, _ := randomUser(t)
	n := 5
	scores := make([]db.Score, n)
	for i := range n {
		scores[i] = randomScore(user.Username)
	}

	type Query struct {
		PageID   int
		PageSize int
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
				PageID:   1,
				PageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.RankByScoreParams{
					Limit:  int32(n),
					Offset: 0,
				}

				dbqtx.EXPECT().
					RankByScore(gomock.Any(), gomock.Eq(arg)).
					Times(1).
					Return(scores, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "InvalidPageID",
			query: Query{
				PageID:   0,
				PageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					RankByScore(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InvalidPageSize",
			query: Query{
				PageID:   1,
				PageSize: 100000,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					RankByScore(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InternalError",
			query: Query{
				PageID:   1,
				PageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					RankByScore(gomock.Any(), gomock.Any()).
					Times(1).
					Return([]db.Score{}, sql.ErrConnDone)
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
			tc.buildStubs(dbqtx)

			server := newTestServer(t, dbqtx, nil)
			recorder := httptest.NewRecorder()

			url := "/api/rank/scores"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			q := request.URL.Query()
			q.Add("page_id", fmt.Sprintf("%d", tc.query.PageID))
			q.Add("page_size", fmt.Sprintf("%d", tc.query.PageSize))
			request.URL.RawQuery = q.Encode()

			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func TestRankByLevel(t *testing.T) {
	user, _ := randomUser(t)
	n := 5
	scores := make([]db.Score, n)
	for i := range n {
		scores[i] = randomScore(user.Username)
	}

	type Query struct {
		PageID   int
		PageSize int
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
				PageID:   1,
				PageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.RankByLevelParams{
					Limit:  int32(n),
					Offset: 0,
				}

				dbqtx.EXPECT().
					RankByLevel(gomock.Any(), gomock.Eq(arg)).
					Times(1).
					Return(scores, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "InvalidPageID",
			query: Query{
				PageID:   0,
				PageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					RankByLevel(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InvalidPageSize",
			query: Query{
				PageID:   1,
				PageSize: 100000,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					RankByLevel(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InternalError",
			query: Query{
				PageID:   1,
				PageSize: n,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					RankByLevel(gomock.Any(), gomock.Any()).
					Times(1).
					Return([]db.Score{}, sql.ErrConnDone)
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
			tc.buildStubs(dbqtx)

			server := newTestServer(t, dbqtx, nil)
			recorder := httptest.NewRecorder()

			url := "/api/rank/levels"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			q := request.URL.Query()
			q.Add("page_id", fmt.Sprintf("%d", tc.query.PageID))
			q.Add("page_size", fmt.Sprintf("%d", tc.query.PageSize))
			request.URL.RawQuery = q.Encode()

			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

package api

import (
	"database/sql"
	"net/http"
	"net/http/httptest"
	"testing"

	mockdb "github.com/isaac8838/tetris-game/db/mock"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
)

func TestListAchievements(t *testing.T) {
	user, _ := randomUser(t)
	n := 5
	achievements := make([]db.Achievement, n)
	for i := 0; i < n; i++ {
		achievements[i] = randomAchievements(user.Username)
	}

	type Query struct {
		owner string
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
				owner: user.Username,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					ListAchievements(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(achievements, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "InternalError",
			query: Query{
				owner: user.Username,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					ListAchievements(gomock.Any(), gomock.Any()).
					Times(1).
					Return([]db.Achievement{}, sql.ErrConnDone)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
		{
			name: "BadRequest",
			query: Query{
				owner: "-",
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					ListAchievements(gomock.Any(), gomock.Any()).
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

			url := "/achievements"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			q := request.URL.Query()
			q.Add("owner", tc.query.owner)
			request.URL.RawQuery = q.Encode()

			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func randomAchievements(owner string) db.Achievement {
	id := utils.CreateRandomNumber(1, 10)

	return db.Achievement{
		Owner:         owner,
		AchievementID: int32(id),
	}
}

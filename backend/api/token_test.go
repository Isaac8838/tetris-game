package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	mockapi "github.com/isaac8838/tetris-game/api/mock"
	mockdb "github.com/isaac8838/tetris-game/db/mock"
	"github.com/isaac8838/tetris-game/utils"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
)

func TestRenewTokenAPI(t *testing.T) {
	testCase := []struct {
		name          string
		buildStubs    func(helper *mockapi.MockHelper)
		checkResponse func(recoder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			buildStubs: func(helper *mockapi.MockHelper) {
				helper.EXPECT().
					DetectedRefreshTokenReused(gomock.Any()).
					AnyTimes().
					Return(nil)
			},
			checkResponse: func(recoder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recoder.Code)
			},
		},
		{
			name: "ReusedTokenDetected",
			buildStubs: func(helper *mockapi.MockHelper) {
				helper.EXPECT().
					DetectedRefreshTokenReused(gomock.Any()).
					Times(1).
					Return(fmt.Errorf("refresh token is reused, user might be hacked"))
			},
			checkResponse: func(recoder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recoder.Code)
			},
		},
		{
			name: "InvalidToken",
			buildStubs: func(helper *mockapi.MockHelper) {
				helper.EXPECT().
					DetectedRefreshTokenReused(gomock.Any()).
					AnyTimes().
					Return(nil)
			},
			checkResponse: func(recoder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recoder.Code)
			},
		},
		{
			name: "ExpiredToken",
			buildStubs: func(helper *mockapi.MockHelper) {
				helper.EXPECT().
					DetectedRefreshTokenReused(gomock.Any()).
					AnyTimes().
					Return(nil)
			},
			checkResponse: func(recoder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recoder.Code)
			},
		},
	}

	for i := range testCase {
		tc := testCase[i]

		t.Run(tc.name, func(t *testing.T) {

			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			dbqtx := mockdb.NewMockDBQTx(ctrl)
			mockHelper := mockapi.NewMockHelper(ctrl)
			tc.buildStubs(mockHelper)

			server := newTestServer(t, dbqtx, mockHelper)
			var data []byte
			var err error

			username := utils.CreateRandomName()
			refreshToken, _, err := server.tokenMaker.CreateToken(username, time.Hour)
			require.NoError(t, err)
			require.NotEmpty(t, refreshToken)
			expiredToken, _, err := server.tokenMaker.CreateToken(username, -time.Hour)
			require.NoError(t, err)
			require.NotEmpty(t, expiredToken)

			if i == 2 {
				data, err = json.Marshal(gin.H{
					"refresh_token": "1234",
				})
				require.NoError(t, err)
			} else if i == 3 {
				data, err = json.Marshal(gin.H{
					"refresh_token": expiredToken,
				})
				require.NoError(t, err)
			} else {
				data, err = json.Marshal(gin.H{
					"refresh_token": refreshToken,
				})
				require.NoError(t, err)
			}

			url := "/tokens/renew_access"
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)

			recoder := httptest.NewRecorder()
			server.router.ServeHTTP(recoder, request)
			tc.checkResponse(recoder)
		})
	}
}

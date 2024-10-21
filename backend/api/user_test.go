package api

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
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

// create a password matcher to build a strong test.
type eqCreateUserTxParamsMatcher struct {
	arg      db.CreateUserTxParams
	password string
}

func (e eqCreateUserTxParamsMatcher) Matches(x any) bool {
	arg, ok := x.(db.CreateUserTxParams)
	if !ok {
		return false
	}

	err := utils.CheckPassword(arg.CreateUserParams.HashedPassword, e.password)
	if err != nil {
		return false
	}

	e.arg.CreateUserParams.HashedPassword = arg.CreateUserParams.HashedPassword
	return reflect.DeepEqual(e.arg, arg)
}

func (e eqCreateUserTxParamsMatcher) String() string {
	return fmt.Sprintf("matches arg %v and password %v", e.arg.CreateUserParams, e.password)
}

func EqCreateUserTxParams(arg db.CreateUserTxParams, password string) gomock.Matcher {
	return eqCreateUserTxParamsMatcher{arg, password}
}

func TestCreateUserAPI(t *testing.T) {
	user, password := randomUser(t)
	testCases := []struct {
		name          string
		body          gin.H
		buildStubs    func(dbqtx *mockdb.MockDBQTx)
		checkResponse func(recorder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			body: gin.H{
				"username": user.Username,
				"password": password,
				"email":    user.Email,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				arg := db.CreateUserTxParams{
					CreateUserParams: db.CreateUserParams{
						Username: user.Username,
						Email:    user.Email,
					},
				}
				balanceArg := db.CreateBalanceTxParams{
					CreateBalanceParams: db.CreateBalanceParams{
						Owner: user.Username,
						Balance: pgtype.Int8{
							Int64: 200,
							Valid: true,
						},
					},
				}
				skinArg := db.CreateSkinTxParams{
					CreateSkinParams: db.CreateSkinParams{
						Owner:       user.Username,
						SkinID:      0,
						DefaultSkin: true,
					},
				}
				dbqtx.EXPECT().
					CreateUserTx(gomock.Any(), EqCreateUserTxParams(arg, password)).
					Times(1).
					Return(db.CreateUserTxResult{User: user}, nil)
				dbqtx.EXPECT().
					CreateBalanceTx(gomock.Any(), gomock.Eq(balanceArg)).
					Times(1).
					Return(db.CreateBalanceTxResult{Balance: db.Balance{Owner: user.Username, Balance: balanceArg.Balance}}, nil)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Eq(skinArg)).
					Times(1).
					Return(db.CreateSkinTxResult{Skin: db.Skin{Owner: user.Username, SkinID: 0, DefaultSkin: true}}, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
				requireBodyMatchUser(t, recorder.Body, user)
			},
		},
		{
			name: "InternalError",
			body: gin.H{
				"username": user.Username,
				"password": password,
				"email":    user.Email,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					CreateUserTx(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.CreateUserTxResult{}, sql.ErrConnDone)
				dbqtx.EXPECT().
					CreateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
		{
			name: "DuplicateUsername",
			body: gin.H{
				"username": user.Username,
				"password": password,
				"email":    user.Email,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					CreateUserTx(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.CreateUserTxResult{}, db.ErrUniqueViolation)
				dbqtx.EXPECT().
					CreateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusForbidden, recorder.Code)
			},
		},
		{
			name: "InvalidUsername",
			body: gin.H{
				"username": "invalid-user#1",
				"password": password,
				"email":    user.Email,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					CreateUserTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InvalidEmail",
			body: gin.H{
				"username": user.Username,
				"password": password,
				"email":    "invalid-email",
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					CreateUserTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "TooShortPassword",
			body: gin.H{
				"username": user.Username,
				"password": "123",
				"email":    user.Email,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					CreateUserTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
	}

	for i := range testCases {
		tc := testCases[i]

		t.Run(tc.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			dbqtx := mockdb.NewMockDBQTx(ctrl)
			tc.buildStubs(dbqtx)

			helper := mockapi.NewMockHelper(ctrl)

			server := newTestServer(t, dbqtx, helper)
			recorder := httptest.NewRecorder()

			data, err := json.Marshal(tc.body)
			require.NoError(t, err)
			require.NotEmpty(t, data)

			url := "/api/users"
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)

			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func TestLoginUserAPI(t *testing.T) {
	user, password := randomUser(t)

	testCases := []struct {
		name          string
		body          gin.H
		buildStubs    func(dbqtx *mockdb.MockDBQTx)
		checkResponse func(recoder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			body: gin.H{
				"username": user.Username,
				"password": password,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(user, nil)
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Skin{Owner: user.Username, SkinID: 0, DefaultSkin: true}, nil)
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Balance{Owner: user.Username, Balance: pgtype.Int8{Int64: 200, Valid: true}}, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "UserNotFound",
			body: gin.H{
				"username": user.Username,
				"password": password,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.User{}, db.ErrRecordNotFound)
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusNotFound, recorder.Code)
			},
		},
		{
			name: "IncorrectPassword",
			body: gin.H{
				"username": user.Username,
				"password": "incorrect",
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(user, nil)
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "InternalError",
			body: gin.H{
				"username": user.Username,
				"password": password,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(user, sql.ErrConnDone)
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
		{
			name: "InvalidUsername",
			body: gin.H{
				"username": "invalid-user#1",
				"password": password,
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "InvalidPassword",
			body: gin.H{
				"username": user.Username,
				"password": "123",
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Eq(user.Username)).
					Times(0)
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Any()).
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
			helper := mockapi.NewMockHelper(ctrl)

			server := newTestServer(t, dbqtx, helper)
			recorder := httptest.NewRecorder()

			data, err := json.Marshal(tc.body)
			require.NoError(t, err)

			url := "/api/users/login"
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)

			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func TestUserProfileAPI(t *testing.T) {
	user, _ := randomUser(t)

	testCases := []struct {
		name          string
		setupAuth     func(t *testing.T, request *http.Request, tokenMaker token.Maker)
		buildStubs    func(dbqtx *mockdb.MockDBQTx)
		checkResponse func(recorder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(user, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "NoAuthorization",
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {

			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "NoUserRecord",
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.User{}, db.ErrRecordNotFound)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusNotFound, recorder.Code)
			},
		},
		{
			name: "InternalError",
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetUser(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.User{}, sql.ErrConnDone)
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

			url := "/api/users"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			tc.setupAuth(t, request, server.tokenMaker)
			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)

		})
	}
}

func randomUser(t *testing.T) (user db.User, password string) {
	password = utils.CreateRandomString(6)
	hashedPassword, err := utils.HashedPassword(password)
	require.NoError(t, err)

	user = db.User{
		Username:       utils.CreateRandomName(),
		HashedPassword: hashedPassword,
		Email:          utils.CreateRandomEmail(),
	}
	return
}

func requireBodyMatchUser(t *testing.T, body *bytes.Buffer, user db.User) {
	data, err := io.ReadAll(body)
	require.NoError(t, err)

	var gotUser db.User
	err = json.Unmarshal(data, &gotUser)
	require.NoError(t, err)
	require.Equal(t, user.Username, gotUser.Username)
	require.Equal(t, user.Email, gotUser.Email)
	require.Empty(t, gotUser.HashedPassword)
}

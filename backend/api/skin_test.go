package api

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	mockdb "github.com/isaac8838/tetris-game/db/mock"
	db "github.com/isaac8838/tetris-game/db/sqlc"
	"github.com/isaac8838/tetris-game/token"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
)

type eqUpdateBalanceTxParamsMatcher struct {
	arg db.UpdateBalanceTxParams
}

func (e eqUpdateBalanceTxParamsMatcher) Matches(x any) bool {
	arg, ok := x.(db.UpdateBalanceTxParams)
	if !ok {
		return false
	}

	if arg.UpdateBalanceParams.Balance.Int64 != e.arg.UpdateBalanceParams.Balance.Int64 ||
		arg.UpdateBalanceParams.Balance.Valid != e.arg.UpdateBalanceParams.Balance.Valid {
		return false
	}
	if arg.UpdateBalanceParams.Owner != e.arg.UpdateBalanceParams.Owner {
		return false
	}

	e.arg.UpdateBalanceParams.UpdatedAt = arg.UpdateBalanceParams.UpdatedAt

	return reflect.DeepEqual(e.arg, arg)
}

func (e eqUpdateBalanceTxParamsMatcher) String() string {
	return fmt.Sprintf("matches arg %v.", e.arg.UpdateBalanceParams)
}

func EqUpdateBalanceParams(arg db.UpdateBalanceTxParams) gomock.Matcher {
	return eqUpdateBalanceTxParamsMatcher{arg}
}

func TestGetDefaultSkin(t *testing.T) {
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
					GetDefaultSkin(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Skin{Owner: user.Username, SkinID: 0, DefaultSkin: true}, nil)
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
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "RecordNotFound",
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, "someone", time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Eq("someone")).
					Times(1).
					Return(db.Skin{}, db.ErrRecordNotFound)
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
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.Skin{}, sql.ErrConnDone)
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

			url := "/api/skin/default"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			tc.setupAuth(t, request, server.tokenMaker)
			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func TestPurchaseSkin(t *testing.T) {
	user, _ := randomUser(t)
	testCases := []struct {
		name          string
		body          gin.H
		setupAuth     func(t *testing.T, request *http.Request, tokenMaker token.Maker)
		buildStubs    func(dbqtx *mockdb.MockDBQTx)
		checkResponse func(recorder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			body: gin.H{
				"amount":  int64(50),
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				skinArg := db.CreateSkinTxParams{
					CreateSkinParams: db.CreateSkinParams{
						Owner:       user.Username,
						SkinID:      int32(1),
						DefaultSkin: false,
					},
				}
				balanceArg := db.UpdateBalanceTxParams{
					UpdateBalanceParams: db.UpdateBalanceParams{
						Balance:   pgtype.Int8{Int64: 150, Valid: true},
						UpdatedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
						Owner:     user.Username,
					},
				}
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Balance{Owner: user.Username, Balance: pgtype.Int8{Int64: 200, Valid: true}}, nil)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Eq(skinArg)).
					Times(1).
					Return(db.CreateSkinTxResult{Skin: db.Skin{Owner: user.Username, SkinID: int32(1), DefaultSkin: false}}, nil)
				dbqtx.EXPECT().
					UpdateBalanceTx(gomock.Any(), EqUpdateBalanceParams(balanceArg)).
					Times(1).
					Return(db.UpdateBalanceTxResult{Balance: db.Balance{Owner: user.Username, Balance: pgtype.Int8{Int64: 150, Valid: true}}}, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "NoAuthorization",
			body: gin.H{
				"amount":  int64(50),
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "BadRequest",
			body: gin.H{
				"amount":  int64(50),
				"skin_id": int32(-1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "BalanceRecordNotFound",
			body: gin.H{
				"amount":  int64(50),
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, "someone", time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Eq("someone")).
					Times(1).
					Return(db.Balance{}, db.ErrRecordNotFound)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusNotFound, recorder.Code)
			},
		},
		{
			name: "InsufficientBalance",
			body: gin.H{
				"amount":  int64(50),
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Balance{Owner: user.Username, Balance: pgtype.Int8{Int64: 0, Valid: true}}, nil)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusForbidden, recorder.Code)
			},
		},
		{
			name: "InternalError",
			body: gin.H{
				"amount":  int64(50),
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Balance{}, sql.ErrConnDone)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateBalanceTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
		{
			name: "UpdateBalanceNotFound",
			body: gin.H{
				"amount":  int64(50),
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				skinArg := db.CreateSkinTxParams{
					CreateSkinParams: db.CreateSkinParams{
						Owner:       user.Username,
						SkinID:      int32(1),
						DefaultSkin: false,
					},
				}
				balanceArg := db.UpdateBalanceTxParams{
					UpdateBalanceParams: db.UpdateBalanceParams{
						Balance:   pgtype.Int8{Int64: 150, Valid: true},
						UpdatedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
						Owner:     user.Username,
					},
				}
				dbqtx.EXPECT().
					GetBalance(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Balance{Owner: user.Username, Balance: pgtype.Int8{Int64: 200, Valid: true}}, nil)
				dbqtx.EXPECT().
					CreateSkinTx(gomock.Any(), gomock.Eq(skinArg)).
					Times(1).
					Return(db.CreateSkinTxResult{Skin: db.Skin{Owner: user.Username, SkinID: int32(1), DefaultSkin: false}}, nil)
				dbqtx.EXPECT().
					UpdateBalanceTx(gomock.Any(), EqUpdateBalanceParams(balanceArg)).
					Times(1).
					Return(db.UpdateBalanceTxResult{}, db.ErrRecordNotFound)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusNotFound, recorder.Code)
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

			data, err := json.Marshal(tc.body)
			require.NoError(t, err)
			require.NotEmpty(t, data)

			url := "/api/skin/purchase"
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)
			require.NotEmpty(t, request)

			tc.setupAuth(t, request, server.tokenMaker)
			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func TestSetDefaultSkin(t *testing.T) {
	user, _ := randomUser(t)
	testCases := []struct {
		name          string
		body          gin.H
		setupAuth     func(t *testing.T, request *http.Request, tokenMaker token.Maker)
		buildStubs    func(dbqtx *mockdb.MockDBQTx)
		checkResponse func(recorder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			body: gin.H{
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				argUpdateDefaultSkin := db.UpdateSkinTxParams{
					UpdateSkinParams: db.UpdateSkinParams{
						Owner:       user.Username,
						SkinID:      0,
						DefaultSkin: false,
					},
				}
				argUpdateSkin := db.UpdateSkinTxParams{
					UpdateSkinParams: db.UpdateSkinParams{
						Owner:       user.Username,
						SkinID:      1,
						DefaultSkin: true,
					},
				}
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Skin{Owner: user.Username, SkinID: 0, DefaultSkin: true}, nil)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Eq(argUpdateDefaultSkin)).
					Times(1).
					Return(db.UpdateSkinTxResult{}, nil)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Eq(argUpdateSkin)).
					Times(1).
					Return(db.UpdateSkinTxResult{Skin: db.Skin{Owner: user.Username, SkinID: 1, DefaultSkin: true}}, nil)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "NoAuthorization",
			body: gin.H{
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "BadRequest",
			body: gin.H{
				"skin_id": int32(-1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "DefaultSkinNotFound",
			body: gin.H{
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Skin{}, db.ErrRecordNotFound)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusNotFound, recorder.Code)
			},
		},
		{
			name: "UpdateDefaultSkinNotFound",
			body: gin.H{
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				argUpdateDefaultSkin := db.UpdateSkinTxParams{
					UpdateSkinParams: db.UpdateSkinParams{
						Owner:       user.Username,
						SkinID:      0,
						DefaultSkin: false,
					},
				}
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Skin{Owner: user.Username, SkinID: 0, DefaultSkin: true}, nil)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Eq(argUpdateDefaultSkin)).
					Times(1).
					Return(db.UpdateSkinTxResult{}, db.ErrRecordNotFound)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusNotFound, recorder.Code)
			},
		},
		{
			name: "UpdateSkinNotFound",
			body: gin.H{
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				argUpdateDefaultSkin := db.UpdateSkinTxParams{
					UpdateSkinParams: db.UpdateSkinParams{
						Owner:       user.Username,
						SkinID:      0,
						DefaultSkin: false,
					},
				}
				argUpdateSkin := db.UpdateSkinTxParams{
					UpdateSkinParams: db.UpdateSkinParams{
						Owner:       user.Username,
						SkinID:      1,
						DefaultSkin: true,
					},
				}
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Skin{Owner: user.Username, SkinID: 0, DefaultSkin: true}, nil)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Eq(argUpdateDefaultSkin)).
					Times(1).
					Return(db.UpdateSkinTxResult{}, nil)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Eq(argUpdateSkin)).
					Times(1).
					Return(db.UpdateSkinTxResult{}, db.ErrRecordNotFound)
			},

			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusNotFound, recorder.Code)
			},
		},
		{
			name: "InternalError",
			body: gin.H{
				"skin_id": int32(1),
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					GetDefaultSkin(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(db.Skin{}, sql.ErrConnDone)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
				dbqtx.EXPECT().
					UpdateSkinTx(gomock.Any(), gomock.Any()).
					Times(0)
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

			data, err := json.Marshal(tc.body)
			require.NoError(t, err)
			require.NotEmpty(t, data)

			url := "/api/skin/set_default"
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)
			require.NotEmpty(t, request)

			tc.setupAuth(t, request, server.tokenMaker)
			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

func TestListSkins(t *testing.T) {
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
				skins := []db.Skin{
					{
						Owner:       user.Username,
						SkinID:      0,
						DefaultSkin: true,
					},
					{
						Owner:       user.Username,
						SkinID:      1,
						DefaultSkin: false,
					},
				}
				dbqtx.EXPECT().
					ListSkins(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return(skins, nil)
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
					ListSkins(gomock.Any(), gomock.Any()).
					Times(0)
			},
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "InternalError",
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Username, time.Minute)
			},
			buildStubs: func(dbqtx *mockdb.MockDBQTx) {
				dbqtx.EXPECT().
					ListSkins(gomock.Any(), gomock.Eq(user.Username)).
					Times(1).
					Return([]db.Skin{}, sql.ErrConnDone)
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

			url := "/api/skin/list_skins"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			tc.setupAuth(t, request, server.tokenMaker)
			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

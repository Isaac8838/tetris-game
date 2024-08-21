package api

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestHealthCheck(t *testing.T) {
	testCase := []struct {
		name          string
		checkResponse func(recorder *httptest.ResponseRecorder)
	}{
		{
			name: "OK",
			checkResponse: func(recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
	}

	for _, tc := range testCase {
		t.Run(tc.name, func(t *testing.T) {
			server := newTestServer(t, nil, nil)
			recorder := httptest.NewRecorder()

			url := "/"
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)
			require.NotEmpty(t, request)

			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(recorder)
		})
	}
}

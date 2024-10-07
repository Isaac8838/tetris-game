package api

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gorilla/websocket"
	"github.com/isaac8838/tetris-game-multiplayer/utils"
)

func newTestServer(config utils.Config, hub *Hub, upgrader websocket.Upgrader) (*Server, error) {
	server := &Server{
		config:   config,
		hub:      hub,
		upgrader: upgrader,
	}
	go hub.run()
	return server, nil
}

func startTestServer(h func(http.ResponseWriter, *http.Request)) string {
	s := httptest.NewServer(http.HandlerFunc(h))
	return s.URL
}

func newTestConfig() utils.Config {
	return utils.Config{}
}

func newTestUpgrader() websocket.Upgrader {
	return websocket.Upgrader{}
}

func TestMain(m *testing.M) {
	os.Exit(m.Run())
}

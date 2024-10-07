package api

import (
	"sort"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/require"
)

func TestLobby(t *testing.T) {
	testCases := []struct {
		name   string
		data   []lobbyResponse
		setup  func(s *Server, data []lobbyResponse)
		action func(url string, data []lobbyResponse)
	}{
		{
			name: "OK",
			data: []lobbyResponse{
				{Id: 1, RoomName: "123", Owner: "qqq"},
				{Id: 2, RoomName: "456", Owner: "www"},
			},
			setup: func(s *Server, data []lobbyResponse) {
				client1 := &Client{
					name: data[0].Owner,
				}
				client2 := &Client{
					name: data[1].Owner,
				}
				room1 := &Room{
					id:   data[0].Id,
					name: data[0].RoomName,
				}
				room2 := &Room{
					id:   data[1].Id,
					name: data[1].RoomName,
				}
				room1.player[0] = client1
				room2.player[0] = client2

				s.hub.rooms[room1.id] = room1
				s.hub.rooms[room2.id] = room2
			},
			action: func(url string, data []lobbyResponse) {
				wsURL := "ws" + strings.TrimPrefix(url, "http")
				clientConn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
				require.NoError(t, err)
				defer clientConn.Close()

				clientConn.SetReadDeadline(time.Now().Add(10 * time.Second))

				var res []lobbyResponse
				err = clientConn.ReadJSON(&res)
				require.NoError(t, err)
				require.Len(t, res, 2)
				for i := 0; i < 2; i++ {
					require.Equal(t, data[i].Id, res[i].Id)
					require.Equal(t, data[i].Owner, res[i].Owner)
					require.Equal(t, data[i].RoomName, res[i].RoomName)
				}
				clientConn.SetReadDeadline(time.Now().Add(10 * time.Second))
				err = clientConn.ReadJSON(&res)
				require.NoError(t, err)
				require.Len(t, res, 2)
				sort.Sort(ById(res))
				for i := 0; i < 2; i++ {
					require.Equal(t, data[i].Id, res[i].Id)
					require.Equal(t, data[i].Owner, res[i].Owner)
					require.Equal(t, data[i].RoomName, res[i].RoomName)
				}
			},
		},
		{
			name: "EmptyOK",
			data: []lobbyResponse{},
			setup: func(s *Server, data []lobbyResponse) {

			},
			action: func(url string, data []lobbyResponse) {
				wsURL := "ws" + strings.TrimPrefix(url, "http")
				clientConn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
				require.NoError(t, err)
				defer clientConn.Close()

				clientConn.SetReadDeadline(time.Now().Add(10 * time.Second))
				clientConn.SetPongHandler(func(string) error { clientConn.SetReadDeadline(time.Now().Add(10 * time.Second)); return nil })

				var res []lobbyResponse
				err = clientConn.ReadJSON(&res)
				require.NoError(t, err)
				require.Len(t, res, 0)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			config := newTestConfig()
			upgrader := newTestUpgrader()
			hub := NewHub()
			server, err := newTestServer(config, hub, upgrader)
			require.NoError(t, err)

			url := startTestServer(server.lobby)

			tc.setup(server, tc.data)
			tc.action(url, tc.data)

		})
	}
}

type ById []lobbyResponse

func (a ById) Len() int {
	return len(a)
}

func (a ById) Less(i, j int) bool {
	return a[i].Id < a[j].Id
}

func (a ById) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}

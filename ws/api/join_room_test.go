package api

import (
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/require"
)

func TestJoinRoom(t *testing.T) {
	testCases := []struct {
		name       string
		req        joinRoomRequest
		data       []inRoom
		action     func(url string, server *Server, req joinRoomRequest, data []inRoom)
		afterCheck func(server *Server)
	}{
		{
			name: "OK",
			req: joinRoomRequest{
				Player: "2",
				RoomId: 1,
			},
			data: []inRoom{
				{
					Player:    "1",
					Ready:     0,
					GameState: 0,
					Data:      "",
				},
				{
					Player:    "2",
					Ready:     0,
					GameState: 0,
					Data:      "",
				},
			},
			action: func(url string, s *Server, req joinRoomRequest, data []inRoom) {
				wsURL := "ws" + strings.TrimPrefix(url, "http")

				room := createRoom(1, "1")
				client := createClient("1", nil, room, s.hub)
				go room.run()
				room.register <- client
				s.hub.register <- room

				time.Sleep(1 * time.Second)
				_, ok := s.hub.rooms[1]
				require.True(t, ok)

				clientConn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
				require.NoError(t, err)
				defer clientConn.Close()
				clientConn.SetReadDeadline(time.Now().Add(pongWait))

				err = clientConn.WriteJSON(req)
				require.NoError(t, err)

				time.Sleep(1 * time.Second)
				for i := 0; i < 2; i++ {
					room.broadcast <- data[0]
					err = clientConn.WriteJSON(data[1])
					require.NoError(t, err)

					clientConn.SetReadDeadline(time.Now().Add(pongWait))
					var recv [2]inRoom
					recv[1], ok = <-client.send
					require.True(t, ok)
					err = clientConn.ReadJSON(&recv[0])
					require.NoError(t, err)
					for k := 0; k < 2; k++ {
						require.Equal(t, data[k].Player, recv[k].Player)
						require.Equal(t, data[k].Ready, recv[k].Ready)
						require.Equal(t, data[k].GameState, recv[k].GameState)
						require.Equal(t, data[k].Data, recv[k].Data)
					}
				}
				clientConn.Close()
				time.Sleep(1 * time.Second)
				room.broadcast <- data[0]
				recv, ok := <-client.send
				require.True(t, ok)
				require.Equal(t, "", recv.Player)
				require.Equal(t, int8(0), recv.Ready)
				require.Equal(t, int8(0), recv.GameState)
				require.Equal(t, "", recv.Data)
				s.hub.unregister <- client.room
			},
			afterCheck: func(s *Server) {
				time.Sleep(1 * time.Second)
				_, ok := s.hub.rooms[1]
				require.True(t, !ok)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			config := newTestConfig()
			hub := NewHub()
			upgrader := newTestUpgrader()

			server, err := newTestServer(config, hub, upgrader)
			require.NoError(t, err)

			url := startTestServer(server.joinRoom)

			tc.action(url, server, tc.req, tc.data)
			tc.afterCheck(server)
		})
	}
}

import { transferToWebsocketData, websocketDataToRows } from "@/utils/Cell";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { reset, setGameState } from "../Tetris/TetrisSlice";
import { transferToBoard } from "@/utils/Board";
import { useOpponentDataContext } from "./OpponentDataContext";
import useConnectionTimeout from "./useConnectionTimeout";

const useGameRoomSocketClient = ({ socketUrl }) => {
    const { room_id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { opponentData, opponentDispatch } = useOpponentDataContext();

    const [shouldSend, setShouldSend] = useState(false);

    const { username } = useSelector((state) => state.user);
    const { gameState, playerReady, board, tetromino, stats } = useSelector(
        (state) => state.tetris,
    );

    const usernameRef = useRef(username);
    const room_idRef = useRef(room_id);
    const playerReadyRef = useRef(playerReady);
    const boardDataRef = useRef(board);
    const gameStateRef = useRef(0);
    const opponentDataRef = useRef(opponentData);
    const statsRef = useRef(stats);

    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log("websocket connected");
            sendMessage(
                JSON.stringify({
                    player: username,
                    room_id: parseInt(room_id),
                }),
            );
        },
        onClose: () => {
            dispatch(reset());
            opponentDispatch({ type: "resetOpponentData" });
            navigate("/room");
            console.log("websocket disconnected");
        },
    });

    const { resetConnectionTimeout, clearConnectionTimeout } =
        useConnectionTimeout(
            useCallback(() => {
                //對手斷線，直接勝利
                dispatch(setGameState(3));
            }, [dispatch]),
        );

    //更新狀態
    useEffect(() => {
        //把玩家現在移動的方塊轉換成websocket上傳的格式
        if (gameState === 0) {
            boardDataRef.current = transferToWebsocketData(board.rows);
        }
        if (gameState === 1) {
            boardDataRef.current = transferToWebsocketData(
                //把玩家現在移動的方塊轉換到board上
                transferToBoard({
                    rows: board.rows,
                    tetromino: tetromino.tetromino,
                    position: tetromino.position,
                    collide: false,
                }),
            );
        }
    }, [board, tetromino, gameState]);

    useEffect(() => {
        room_idRef.current = room_id;
        usernameRef.current = username;
        playerReadyRef.current = playerReady;
    }, [room_id, username, playerReady]);

    useEffect(() => {
        gameStateRef.current = gameState;
        if (gameState !== 1) {
            clearConnectionTimeout();
        }
    }, [gameState, clearConnectionTimeout]);

    useEffect(() => {
        opponentDataRef.current = opponentData;
    }, [opponentData]);

    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    //接收
    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);

            if (data?.ready === "OK") {
                // console.log("收到ready");
                setShouldSend(true);
            } else {
                if (
                    typeof data?.game_state === "number" &&
                    data?.player !== ""
                ) {
                    resetConnectionTimeout();

                    const dataData = JSON.parse(data.data);

                    // 設定自己遊戲狀態
                    if (data.game_state === 1 && gameStateRef.current === 0) {
                        dispatch(setGameState(1));
                    } else if (
                        data.game_state === 2 &&
                        gameStateRef.current === 1
                    ) {
                        dispatch(setGameState(3));
                    }
                    // 處理對手數據
                    opponentDispatch({
                        type: "receiveOpponentData",
                        payload: {
                            player:
                                data.game_state === 0 || data.game_state === 1
                                    ? data?.player
                                    : opponentDataRef.current.player,
                            ready: data?.ready,
                            gameState: data?.game_state,
                            data:
                                data.game_state === 2 || data.game_state === 3
                                    ? //勝利或輸時只傳分數
                                      {
                                          stats: {
                                              score: dataData.stats.score,
                                              level: dataData.stats.level,
                                              lines: dataData.stats.lines,
                                          },
                                      }
                                    : data.data !== "" && {
                                          board: websocketDataToRows(dataData),
                                      },
                        },
                    });
                }
            }
        }
    }, [lastMessage, dispatch, resetConnectionTimeout, opponentDispatch]);

    //發送
    useEffect(() => {
        if (shouldSend) {
            console.log("設定發送");

            const intervalId = setInterval(() => {
                const sendData =
                    gameStateRef.current === 2 || gameStateRef.current === 3
                        ? JSON.stringify({
                              stats: statsRef.current,
                          })
                        : JSON.stringify(boardDataRef.current);

                sendMessage(
                    JSON.stringify({
                        player: usernameRef.current,
                        ready: playerReadyRef.current ? 1 : 0,
                        game_state: gameStateRef.current,
                        data: sendData,
                    }),
                    // JSON.stringify({
                    //     player: usernameRef.current,
                    //     ready: playerReadyRef.current ? 1 : 0,
                    //     game_state: gameStateRef.current,
                    //     data: "",
                    // }),
                );
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [shouldSend, sendMessage]);

    // return { recceivedData };
};

export default useGameRoomSocketClient;

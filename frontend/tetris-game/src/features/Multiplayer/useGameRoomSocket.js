import { transferToWebsocketData, websocketDataToRows } from "@/utils/Cell";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { reset, setGameState } from "../Tetris/TetrisSlice";
import { transferToBoard } from "@/utils/Board";
import { useOpponentDataContext } from "./OpponentDataContext";
import useConnectionTimeout from "./useConnectionTimeout";
import { useNavigate } from "react-router-dom";

const useGameRoomSocket = ({ socketUrl }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { opponentData, opponentDispatch } = useOpponentDataContext();

    const [shouldSend, setStartSend] = useState(false);
    const [room_id, setRoom_id] = useState("");

    const { username } = useSelector((state) => state.user);
    const { playerReady, board, tetromino, gameState, stats } = useSelector(
        (state) => state.tetris,
    );

    const boardDataRef = useRef(board);
    const usernameRef = useRef(username);
    const playerReadyRef = useRef(playerReady);
    const gameStateRef = useRef(gameState);
    const opponentDataRef = useRef(opponentData);
    const statsRef = useRef(stats);

    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log("websocket connected"),
        onClose: () => {
            dispatch(reset());
            opponentDispatch({ type: "resetOpponentData" });
            navigate("/home");
            console.log("websocket disconnected");
        },
    });

    //檢查斷線
    const { resetConnectionTimeout, clearConnectionTimeout } =
        useConnectionTimeout(
            useCallback(() => {
                //對手斷線，直接勝利
                dispatch(setGameState(3));
            }, [dispatch]),
        );

    useEffect(() => {
        //把玩家現在移動的方塊轉換成websocket上傳的格式
        boardDataRef.current = transferToWebsocketData(
            //把玩家現在移動的方塊轉換到board上
            transferToBoard({
                rows: board.rows,
                tetromino: tetromino.tetromino,
                position: tetromino.position,
                collide: false,
            }),
        );
    }, [board, tetromino]);

    useEffect(() => {
        usernameRef.current = username; // 更新 username 的 ref 值
    }, [username]);

    useEffect(() => {
        playerReadyRef.current = playerReady; // 更新 isReady 的 ref 值
    }, [playerReady]);

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

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);

            if (data.room_id) {
                //host第一步接收到room_id
                // console.log("收到room_id");
                setRoom_id(data.room_id);
                setStartSend(true);
            } else {
                //接收到其他資料
                if (
                    typeof data?.game_state === "number" &&
                    data?.player !== ""
                ) {
                    // console.log("收到", data);

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
    }, [lastMessage, opponentDispatch, resetConnectionTimeout, dispatch]);

    useEffect(() => {
        if (shouldSend) {
            console.log("設定發送");
            // console.log("發送狀態", gameStateRef.current);
            // 每秒發送資料
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
                );
            }, 1000);

            // 清除 interval
            return () => {
                console.log("清除 interval");
                clearInterval(intervalId);
            };
        }
    }, [shouldSend, sendMessage]);

    return { room_id, sendMessage };
};

export default useGameRoomSocket;

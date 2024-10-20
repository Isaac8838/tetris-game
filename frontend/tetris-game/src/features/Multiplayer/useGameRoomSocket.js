import { useCallback, useEffect, useState } from "react";
import useGameRoomSocketBase from "./useGameRoomSocketBase";
import { useDispatch } from "react-redux";
import { setGameState } from "../Tetris/TetrisSlice";
import { useOpponentDataContext } from "./OpponentDataContext";
import { websocketDataToRows } from "@/utils/Cell";

const useGameRoomSocketHost = ({ socketUrl }) => {
    const dispatch = useDispatch();

    const [getRoomId, setGetRoomId] = useState(false);

    const { opponentDispatch } = useOpponentDataContext();

    const {
        lastMessage,
        setShouldSend,
        resetConnectionTimeout,
        gameStateRef,
        opponentDataRef,
        sendMessage,
        statsRef,
    } = useGameRoomSocketBase({
        socketUrl,
        onGameStateChange: useCallback(
            (state) => dispatch(setGameState(state)),
            [dispatch],
        ),
    });

    // 處理主機的邏輯
    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            console.log("收到資料", data);
            if (data?.room_id) {
                // 收到 room_id 後，設定發送資料
                console.log("設定發送");
                setShouldSend(true);
                setGetRoomId(true);
            } else {
                if (
                    typeof data?.game_state === "number" &&
                    data?.player !== ""
                ) {
                    resetConnectionTimeout();

                    const dataData = JSON.parse(data.data);

                    // 設定自己遊戲狀態(開始)
                    if (data.game_state === 1 && gameStateRef.current === 0) {
                        dispatch(setGameState(1));
                    }

                    // 設定自己遊戲狀態(結束)
                    if (data.game_state !== 1 && gameStateRef.current === 2) {
                        console.log("遊戲結束");
                        console.log("我方", statsRef.current.score);

                        // 設定勝利
                        if (dataData.stats.score < statsRef.current.score) {
                            dispatch(setGameState(3));
                        }

                        // 設定輸
                        if (dataData.stats.score > statsRef.current.score) {
                            dispatch(setGameState(4));
                        }

                        // 設定平手
                        if (dataData.stats.score == statsRef.current.score) {
                            dispatch(setGameState(5));
                        }
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
                            data: {
                                stats: {
                                    score: dataData.stats.score,
                                    level: dataData.stats.level,
                                    lines: dataData.stats.lines,
                                },
                                board: websocketDataToRows(dataData.board),
                            },
                        },
                    });
                }
            }
        }
    }, [
        lastMessage,
        resetConnectionTimeout,
        setShouldSend,
        opponentDispatch,
        dispatch,
        gameStateRef,
        statsRef,
        opponentDataRef,
    ]);

    return { getRoomId, sendMessage };
};

export default useGameRoomSocketHost;

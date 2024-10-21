import { useEffect, useRef, useState, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { reset } from "../Tetris/TetrisSlice";
import { useOpponentDataContext } from "./OpponentDataContext";
import useConnectionTimeout from "./useConnectionTimeout";
import { useDispatch, useSelector } from "react-redux";
import { transferToWebsocketData } from "@/utils/Cell";
import { transferToBoard } from "@/utils/Board";
import { useParams } from "react-router-dom";

const useGameRoomSocketBase = ({ socketUrl, onGameStateChange }) => {
    //只有client會有room_id
    const { room_id } = useParams();

    const dispatch = useDispatch();
    const { opponentData, opponentDispatch } = useOpponentDataContext();

    const [shouldSend, setShouldSend] = useState(false);

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

    const { resetConnectionTimeout, clearConnectionTimeout } =
        useConnectionTimeout(
            useCallback(() => {
                // 處理斷線邏輯
                onGameStateChange(3); // 比如傳遞3表示勝利或其他狀態
            }, [onGameStateChange]),
        );

    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log("websocket connected");
            if (room_id) {
                sendMessage(
                    JSON.stringify({
                        player: usernameRef.current,
                        room_id: parseInt(room_id),
                    }),
                );
            }
        },
        onClose: () => {
            dispatch(reset());
            opponentDispatch({ type: "resetOpponentData" });
            clearConnectionTimeout();
            console.log("websocket disconnected");
        },
    });

    //更新board
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

    //更新gameState
    useEffect(() => {
        gameStateRef.current = gameState;
        if (gameState !== 1) {
            clearConnectionTimeout();
        }
    }, [gameState, clearConnectionTimeout]);

    //更新opponentData
    useEffect(() => {
        opponentDataRef.current = opponentData;
    }, [opponentData]);

    //更新stats
    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    //更新username
    useEffect(() => {
        usernameRef.current = username; // 更新 username 的 ref 值
    }, [username]);

    //更新playerReady
    useEffect(() => {
        playerReadyRef.current = playerReady; // 更新 isReady 的 ref 值
    }, [playerReady]);

    useEffect(() => {
        if (shouldSend) {
            const intervalId = setInterval(() => {
                const sendData = JSON.stringify({
                    stats: statsRef.current,
                    board: boardDataRef.current,
                });

                sendMessage(
                    JSON.stringify({
                        player: usernameRef.current,
                        ready: playerReadyRef.current ? 1 : 0,
                        game_state: gameStateRef.current,
                        data: sendData,
                    }),
                );
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [shouldSend, sendMessage]);

    return {
        lastMessage,
        setShouldSend,
        resetConnectionTimeout,
        clearConnectionTimeout,
        gameStateRef,
        opponentDataRef,
        statsRef,
        sendMessage,
    };
};

export default useGameRoomSocketBase;

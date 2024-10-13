import { transferToWebsocketData } from "@/utils/Cell";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { setGameState } from "../Tetris/TetrisSlice";

const useGameRoomSocket = ({ socketUrl }) => {
    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log("websocket connected"),
        onClose: () => console.log("websocket disconnected"),
    });
    const dispatch = useDispatch();

    const [shouldSend, setStartSend] = useState(false);
    const [room_id, setRoom_id] = useState("");
    const [recceivedData, setReceivedData] = useState(null);

    const { username } = useSelector((state) => state.user);
    const { playerReady, board, gameState } = useSelector(
        (state) => state.tetris,
    );

    const boardRef = useRef(board);
    const usernameRef = useRef(username);
    const playerReadyRef = useRef(playerReady);
    const gameStateRef = useRef(gameState);

    useEffect(() => {
        boardRef.current = board; // 更新 board 的 ref 值
    }, [board]);

    useEffect(() => {
        usernameRef.current = username; // 更新 username 的 ref 值
    }, [username]);

    useEffect(() => {
        playerReadyRef.current = playerReady; // 更新 isReady 的 ref 值
    }, [playerReady]);

    useEffect(() => {
        gameStateRef.current = gameState; // 更新 gameState 的 ref 值
    }, [gameState]);

    useEffect(() => {
        if (recceivedData?.ready && playerReady) dispatch(setGameState(1));
    }, [recceivedData?.ready, playerReady, dispatch]);

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);

            if (data.room_id) {
                //host第一步接收到room_id
                console.log("收到room_id");
                setRoom_id(data.room_id);
                setStartSend(true);
            } else {
                //接收到其他資料
                console.log("收到Data資料", data);
                setReceivedData(data);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        if (shouldSend) {
            console.log("設定發送");

            // 每秒發送資料
            const intervalId = setInterval(() => {
                sendMessage(
                    JSON.stringify({
                        player: usernameRef.current,
                        ready: playerReadyRef.current ? 1 : 0,
                        game_state: gameStateRef.current,
                        data: JSON.stringify(
                            transferToWebsocketData(boardRef.current),
                        ),
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

    return { room_id, sendMessage, recceivedData };
};

export default useGameRoomSocket;

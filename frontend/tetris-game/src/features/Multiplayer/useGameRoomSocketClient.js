import { transferToWebsocketData } from "@/utils/Cell";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { setGameState } from "../Tetris/TetrisSlice";

const useGameRoomSocketClient = ({ socketUrl, setConnected }) => {
    const { room_id } = useParams();
    const { playerReady, board } = useSelector((state) => state.tetris);
    const dispatch = useDispatch();

    const [shouldSend, setShouldSend] = useState(false);
    const [recceivedData, setReceivedData] = useState(null);

    const { username } = useSelector((state) => state.user);
    const { gameState } = useSelector((state) => state.tetris);

    const usernameRef = useRef(username);
    const room_idRef = useRef(room_id);
    const playerReadyRef = useRef(playerReady);
    const boardRef = useRef(board);
    const gameStateRef = useRef(0);

    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log("websocket connected");
            sendMessage(
                JSON.stringify({
                    player: username,
                    room_id: parseInt(room_id),
                }),
            );
            setConnected(1);
        },
        onClose: () => {
            console.log("websocket disconnected");
            setConnected(2);
        },
    });

    //更新狀態
    useEffect(() => {
        room_idRef.current = room_id;
        usernameRef.current = username;
        playerReadyRef.current = playerReady;
    }, [room_id, username, playerReady]);

    useEffect(() => {
        boardRef.current = board;
    }, [board]);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    //接收
    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);

            if (data?.ready === "OK") {
                console.log("收到ready");
                setShouldSend(true);
            } else {
                setReceivedData(data);
                console.log("收到data", data);
                if (data?.game_state === 1) {
                    dispatch(setGameState(data.game_state));
                }
            }
        }
    }, [lastMessage, dispatch]);

    //發送
    useEffect(() => {
        if (shouldSend) {
            console.log("設定發送");

            const intervalId = setInterval(() => {
                console.log("發送");

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

            return () => clearInterval(intervalId);
        }
    }, [shouldSend, sendMessage]);

    return { recceivedData };
};

export default useGameRoomSocketClient;

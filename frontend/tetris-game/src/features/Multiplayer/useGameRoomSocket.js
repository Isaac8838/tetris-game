import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const useGameRoomSocket = ({ socketUrl }) => {
    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log("websocket connected"),
        onClose: () => console.log("websocket disconnected"),
    });

    const [shouldSend, setStartSend] = useState(false);
    const [room_id, setRoom_id] = useState("");
    const [recceivedData, setReceivedData] = useState(null);

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);

            if (data.room_id) {
                //host第一步接收到room_id
                console.log("收到room_id");
                setRoom_id(data.room_id);
                setStartSend(true);
            } else if (data?.ready === "OK") {
                console.log("收到ready");
                //client第一次接收到ready
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
                console.log("發送");
                sendMessage(
                    JSON.stringify({
                        player: "p1",
                        ready: 0,
                        game_state: 0,
                        data: "",
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

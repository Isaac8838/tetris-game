import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const useMultiplayerData = ({ socketUrl }) => {
    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log("websocket connected"),
        onClose: () => console.log("websocket disconnected"),
    });

    const [shouldSend, setShouldSend] = useState(false);
    const [room_id, setRoom_id] = useState("");

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);

            if (data.room_id) {
                //host第一步接收到room_id
                setRoom_id(data.room_id);
                setShouldSend(true);
            } else if (data?.ready === "OK") {
                //client第一次接收到ready
                setShouldSend(true);
            } else {
                console.log("接收");
                console.log("data:", data);
                setShouldSend(true);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        const asyncSend = async () => {
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
                return () => clearInterval(intervalId);
            }
        };

        asyncSend();
    }, [shouldSend, sendMessage]);

    return { room_id, sendMessage };
};

export default useMultiplayerData;

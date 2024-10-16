import useWebSocket from "react-use-websocket";

import Table from "@/ui/Table";
import { useEffect, useState } from "react";

const socketUrl = "ws://localhost:8081/lobby";

const Room = () => {
    const [rooms, setRooms] = useState([]);

    const { lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log("websocket connected"),
        onClose: () => console.log("websocket disconnected"),
    });

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            setRooms(data);
            // console.log("Received message:", data); // 印出接收到的資料
        }
    }, [lastMessage]);

    return (
        <div className="m-auto flex h-full w-[70%] max-w-[900px] flex-col items-center justify-center">
            <Table cols=" 0.5fr 1fr 0.5fr">
                <Table.Container>
                    <Table.Header titles={["Room ID", "Room Name", "Host"]} />
                    <div className="flex flex-col gap-1 overflow-hidden rounded-2xl">
                        {rooms ? (
                            rooms.map((data, i) => (
                                <Table.RoomBody key={`room-${i}`} room={data} />
                            ))
                        ) : (
                            <div className="flex justify-center bg-custom-blue_bg py-4 text-xl text-custom-white_text">
                                No rooms available
                            </div>
                        )}
                    </div>
                </Table.Container>
            </Table>
        </div>
    );
};

export default Room;

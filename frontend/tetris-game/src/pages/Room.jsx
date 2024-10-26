import useWebSocket from "react-use-websocket";

import Table from "@/ui/Table";
import { useEffect, useState } from "react";
import Spinner from "@/ui/Spinner";

const socketUrl = "ws://localhost:8081/lobby";

const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const { lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log("websocket connected");
            setLoading(true);
        },
        onClose: () => {
            console.log("websocket disconnected");
            setLoading(false);
        },
    });

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            setRooms(data);
            setLoading(false);
        }
    }, [lastMessage]);

    return (
        <div className="m-auto flex h-full w-[70%] max-w-[900px] flex-col items-center justify-center">
            <Table cols=" 0.5fr 1fr 0.5fr">
                <Table.Container>
                    <Table.Header titles={["Room ID", "Room Name", "Host"]} />
                    <div className="flex flex-col gap-1 overflow-hidden rounded-2xl">
                        {loading ? (
                            <div className="flex justify-center bg-custom-blue_bg py-4">
                                <Spinner width={30} />
                            </div>
                        ) : rooms ? (
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

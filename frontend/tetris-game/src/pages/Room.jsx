// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

import useWebSocket from "react-use-websocket";

import Table from "@/ui/Table";

const room = [
    { roomId: 1, hadKey: false, roomName: "room1", host: "player1" },
    { roomId: 19, hadKey: true, roomName: "my room", host: "gonason" },
    { roomId: 57, hadKey: false, roomName: "please join", host: "player6" },
    { roomId: 83, hadKey: true, roomName: "room15", host: "shio" },
    { roomId: 26, hadKey: false, roomName: "no friend", host: "kodoku" },
];

const socketUrl = "ws://localhost:8081/lobby";
const testUrl =
    "wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self";

const Room = () => {
    useWebSocket(socketUrl, {
        onOpen: () => console.log("websocket connected"),
        onClose: () => console.log("websocket disconnected"),
    });

    return (
        <div className="m-auto flex h-full w-[70%] max-w-[900px] flex-col items-center justify-center">
            <Table cols=" 0.5fr 1fr 0.5fr">
                <Table.Container>
                    <Table.Header titles={["Room ID", "Room Name", "Host"]} />
                    <div className="flex flex-col gap-1 overflow-hidden rounded-2xl">
                        {room.map((data, i) => (
                            <Table.RoomBody key={`room-${i}`} room={data} />
                        ))}
                    </div>
                </Table.Container>
            </Table>
        </div>
    );
};

export default Room;

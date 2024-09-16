// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

import Table from "@/ui/Table";

const room = [
    { roomId: 1, hadKey: false, roomName: "room1", host: "player1" },
    { roomId: 19, hadKey: true, roomName: "my room", host: "gonason" },
    { roomId: 57, hadKey: false, roomName: "please join", host: "player6" },
    { roomId: 83, hadKey: true, roomName: "room15", host: "shio" },
    { roomId: 26, hadKey: false, roomName: "no friend", host: "kodoku" },
];

const Room = () => {
    return (
        <Table cols="0.2fr 0.5fr 1fr 0.5fr 0.5fr">
            <Table.Container>
                <Table.Header
                    titles={["", "Room ID", "Room Name", "Host", ""]}
                />
                <div className="flex flex-col gap-1 overflow-hidden rounded-2xl">
                    {room.map((data, i) => (
                        <Table.RoomBody key={`room-${i}`} room={data} />
                    ))}
                </div>
            </Table.Container>
        </Table>
    );
};

export default Room;

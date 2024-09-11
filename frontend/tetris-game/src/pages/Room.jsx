import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const rooms = [
    { roomId: 1, hadKey: false, roomName: "room1", host: "player1" },
    { roomId: 19, hadKey: true, roomName: "my room", host: "gonason" },
    { roomId: 57, hadKey: false, roomName: "please join", host: "player6" },
    { roomId: 83, hadKey: true, roomName: "room15", host: "shio" },
    { roomId: 26, hadKey: false, roomName: "no friend", host: "kodoku" },
];

const Room = () => {
    return (
        <div className="rounded-md border border-[#9baec8] overflow-hidden shadow-md min-w-[1000px]">
            <Table className="text-xl text-muted">
                <TableHeader className="bg-blue-900">
                    <TableRow className="text-[#d9e1e8] ">
                        <TableHead className="text-primary-foreground w-[20%]">
                            Room ID
                        </TableHead>
                        <TableHead className="text-primary-foreground w-[30%]">
                            Room Name
                        </TableHead>
                        <TableHead className="text-primary-foreground ">
                            Host
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rooms.length > 0 ? (
                        rooms.map((room, index) => {
                            const className =
                                index % 2 === 0
                                    ? "bg-[#121b93]"
                                    : "bg-[#19318F]";
                            return (
                                <TableRow
                                    key={room.roomId}
                                    className={className}
                                >
                                    <TableCell>{room.roomId}</TableCell>
                                    <TableCell>{room.roomName}</TableCell>
                                    <TableCell>{room.host}</TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan="4" className="text-center">
                                a
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default Room;

import CreateRoom from "@/features/Multiplayer/CreateRoom";
import MultiplayerGame from "@/features/Multiplayer/MultiplayerGame";
import OpponentDataProvider from "@/features/Multiplayer/OpponentDataContext";
import useGameRoomSocket from "@/features/Multiplayer/useGameRoomSocket";

const socketUrl = "ws://localhost:8081/create_room";

const MultipleyerHost = () => {
    const { sendMessage, room_id } = useGameRoomSocket({
        socketUrl,
    });

    return (
        <div>
            {
                //創建完房間後(收到room_id)取消創建房間組件
                !room_id ? (
                    <CreateRoom sendMessage={sendMessage} />
                ) : (
                    <MultiplayerGame />
                )
            }
        </div>
    );
};

const MultiplayerHostWithOpponentData = () => (
    <OpponentDataProvider>
        <MultipleyerHost />
    </OpponentDataProvider>
);

export default MultiplayerHostWithOpponentData;

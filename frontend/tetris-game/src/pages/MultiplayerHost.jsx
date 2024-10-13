import CreateRoom from "@/features/Multiplayer/CreateRoom";
import MultiplayerGame from "@/features/Multiplayer/MultiplayerGame";
import useGameRoomSocket from "@/features/Multiplayer/useGameRoomSocket";
import MultiplayerDataProvider from "@/features/Multiplayer/useMultiplayerDataContext";

const socketUrl = "ws://localhost:8081/create_room";

const MultipleyerHost = () => {
    const { room_id, sendMessage, recceivedData } = useGameRoomSocket({
        socketUrl,
    });
    return (
        <div>
            {
                //創建完房間後(收到room_id)取消創建房間組件
                !room_id ? (
                    <CreateRoom sendMessage={sendMessage} />
                ) : (
                    <MultiplayerDataProvider receiveData={recceivedData}>
                        <MultiplayerGame />
                    </MultiplayerDataProvider>
                )
            }
        </div>
    );
};

export default MultipleyerHost;

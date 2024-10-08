import CreateRoom from "@/features/Multiplayer/CreateRoom";
import MultiplayerGame from "@/features/Multiplayer/MultiplayerGame";
import useMultiplayerData from "@/features/Multiplayer/useMultiplayerData";

const socketUrl = "ws://localhost:8081/create_room";

const MultipleyerHost = () => {
    const { room_id, sendMessage } = useMultiplayerData({ socketUrl });
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

export default MultipleyerHost;

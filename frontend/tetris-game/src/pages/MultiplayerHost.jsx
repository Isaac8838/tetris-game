import CreateRoom from "@/features/Multiplayer/CreateRoom";
import MultiplayerGame from "@/features/Multiplayer/MultiplayerGame";
import OpponentDataProvider from "@/features/Multiplayer/OpponentDataContext";
import useGameRoomSocket from "@/features/Multiplayer/useGameRoomSocket";
import { reset } from "@/features/Tetris/TetrisSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const socketUrl = "ws://localhost:8081/create_room";

const MultipleyerHost = () => {
    const dispatch = useDispatch();

    // Reset the game when the component unmounts
    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const { sendMessage, getRoomId } = useGameRoomSocket({
        socketUrl,
    });

    return (
        <div>
            {
                //創建完房間後(收到room_id)取消創建房間組件
                !getRoomId ? (
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

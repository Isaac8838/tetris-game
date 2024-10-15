import MultiplayerGame from "@/features/Multiplayer/MultiplayerGame";
import OpponentDataProvider from "@/features/Multiplayer/OpponentDataContext";
import useGameRoomSocketClient from "@/features/Multiplayer/useGameRoomSocketClient";

const socketUrl = "ws://localhost:8081/join_room";

const MultiplayerClient = () => {
    useGameRoomSocketClient({ socketUrl });
    return <MultiplayerGame />;
};

const MultiplayerClientWithOpponentData = () => {
    return (
        <OpponentDataProvider>
            <MultiplayerClient />
        </OpponentDataProvider>
    );
};

export default MultiplayerClientWithOpponentData;

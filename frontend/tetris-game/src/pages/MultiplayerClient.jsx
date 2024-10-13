import MultiplayerGame from "@/features/Multiplayer/MultiplayerGame";
import useGameRoomSocketClient from "@/features/Multiplayer/useGameRoomSocketClient";
import MultiplayerDataProvider from "@/features/Multiplayer/useMultiplayerDataContext";
import { useState } from "react";

const socketUrl = "ws://localhost:8081/join_room";

const MultiplayerClient = () => {
    const [connected, setConnected] = useState(0);

    const { recceivedData } = useGameRoomSocketClient({
        socketUrl,
        setConnected,
    });

    if (connected === 0) {
        return <div>Connecting...</div>;
    } else if (connected === 1) {
        return (
            <MultiplayerDataProvider receiveData={recceivedData}>
                <MultiplayerGame />
            </MultiplayerDataProvider>
        );
    } else {
        return <div>connect error</div>;
    }
};

export default MultiplayerClient;

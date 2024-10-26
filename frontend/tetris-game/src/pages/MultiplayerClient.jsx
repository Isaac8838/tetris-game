import MultiplayerGame from "@/features/Multiplayer/MultiplayerGame";
import OpponentDataProvider from "@/features/Multiplayer/OpponentDataContext";
import useGameRoomSocketClient from "@/features/Multiplayer/useGameRoomSocketClient";
import { reset } from "@/features/Tetris/TetrisSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const socketUrl = "ws://localhost:8081/join_room";

const MultiplayerClient = () => {
    const dispatch = useDispatch();

    // Reset the game when the component unmounts
    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

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

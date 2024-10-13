import { useDispatch, useSelector } from "react-redux";
import { setGameState, setPlayerReady } from "../Tetris/TetrisSlice";
import { useMultiplayerDataContext } from "./useMultiplayerDataContext";
import { useEffect, useState } from "react";

const MultuplayerReadyBTN = () => {
    const dispatch = useDispatch();
    const [opponentReady, setOpponentReady] = useState(0);
    const [bgColor, setBgColor] = useState("bg-gray-500");
    const { playerReady } = useSelector((state) => state.tetris);

    const isHost = window.location.pathname.includes("host");
    const { receiveData } = useMultiplayerDataContext();

    useEffect(() => {
        setOpponentReady(receiveData?.ready);
    }, [receiveData?.ready, opponentReady]);

    useEffect(() => {
        if (!isHost) {
            if (!playerReady) setBgColor("bg-custom-green_bg");
            else setBgColor("bg-gray-500");
        } else {
            if (opponentReady) setBgColor("bg-custom-green_bg");
            else setBgColor("bg-gray-500");
        }
        console.log(opponentReady, isHost, playerReady);
    }, [opponentReady, isHost, playerReady]);

    return (
        <button
            onClick={() => {
                dispatch(setPlayerReady(1));
                if (isHost) dispatch(setGameState(1));
            }}
            disabled={playerReady || (isHost && !opponentReady)}
            className={`absolute left-1/2 top-72 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full ${bgColor} py-2 text-3xl text-custom-white_text`}
        >
            {isHost
                ? opponentReady
                    ? "Start"
                    : "Wait Joiner"
                : playerReady
                  ? "Wait Host"
                  : "Ready"}
        </button>
    );
};

export default MultuplayerReadyBTN;

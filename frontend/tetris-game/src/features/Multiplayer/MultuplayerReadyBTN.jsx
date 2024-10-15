import { useDispatch, useSelector } from "react-redux";
import { setGameState, setPlayerReady } from "../Tetris/TetrisSlice";
import { useOpponentDataContext } from "./OpponentDataContext";
import { useEffect, useState } from "react";

const MultuplayerReadyBTN = () => {
    const dispatch = useDispatch();
    const [bgColor, setBgColor] = useState("bg-gray-500");
    const [buttonText, setButtonText] = useState("");
    const [enabled, setEnabled] = useState(false);

    const { playerReady, gameState } = useSelector((state) => state.tetris);
    const { opponentData } = useOpponentDataContext();

    const isHost = window.location.pathname.includes("host");

    useEffect(() => {
        if (isHost) {
            if (
                opponentData?.ready === 1 &&
                opponentData?.gameState === 0 &&
                gameState === 0
            ) {
                setEnabled(true);
            } else {
                setEnabled(false);
            }
        } else {
            if (
                gameState === 0 &&
                opponentData?.gameState === 0 &&
                !playerReady
            ) {
                setEnabled(true);
            } else {
                setEnabled(false);
            }
        }
    }, [
        gameState,
        opponentData?.ready,
        opponentData?.gameState,
        playerReady,
        isHost,
    ]);

    useEffect(() => {
        // console.log("按鈕狀態", enabled);
        if (isHost) {
            if (enabled) {
                setButtonText("Start");
                setBgColor("bg-custom-green_bg");
            } else {
                setButtonText("Wait Joiner");
                setBgColor("bg-gray-500");
            }
        } else {
            if (enabled) {
                setButtonText("Ready");
                setBgColor("bg-custom-green_bg");
            } else {
                setButtonText("Wait Host");
                setBgColor("bg-gray-500");
            }
        }
    }, [enabled, isHost]);

    return (
        <button
            onClick={() => {
                dispatch(setPlayerReady(1));
                if (isHost) dispatch(setGameState(1));
            }}
            disabled={!enabled}
            className={`absolute left-1/2 top-72 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full ${bgColor} py-2 text-3xl text-custom-white_text`}
        >
            {buttonText}
        </button>
    );
};

export default MultuplayerReadyBTN;

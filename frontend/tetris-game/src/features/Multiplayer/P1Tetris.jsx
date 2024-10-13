import { useSelector } from "react-redux";
import Stats from "../Tetris/Stats";
import TetrisPreviews from "../Tetris/TetrisPreviews";
import TetrominoSave from "../Tetris/TetrominoSave";
import MultuplayerReadyBTN from "./MultuplayerReadyBTN";
import Player1Board from "./Player1Board";

const P1Tetris = () => {
    const { username } = useSelector((state) => state.user);

    return (
        <>
            <div className="relative m-auto box-content aspect-[1/2] h-[650px]">
                <Player1Board />
                <TetrisPreviews />
                <TetrominoSave />
                <Stats />
                {/* {ready && <Controller />} */}
                {/* {p1Ready && !gameReady ? (
                    <GameReadyState />
                ) : (
                    <MultuplayerReadyBTN />
                )} */}
                <MultuplayerReadyBTN />
                <div className="flex justify-center text-2xl text-gray-800">
                    {username}
                </div>
            </div>
        </>
    );
};

export default P1Tetris;

import { useDispatch, useSelector } from "react-redux";
import GameOverBTN from "./GameOverBTN";
import { useEffect } from "react";
import { handleSubmitRecord } from "./TetrisSlice";

const GameOver = () => {
    const { score, level, lines } = useSelector((state) => state.tetris.stats);
    const alreadySendRecord = useSelector(
        (state) => state.tetris.alreadySendRecord,
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (!alreadySendRecord) {
            dispatch(handleSubmitRecord());
        }
    }, [alreadySendRecord]);

    return (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-sm gap-4">
            <div className=" text-3xl text-white font-semibold tracking-wider">
                Game Over
            </div>
            <div className=" bg-indigo-800 border-4 border-violet-700 rounded-md px-4 py-4 text-white flex flex-col gap-5 items-center w-64">
                <div className="flex flex-col gap-3">
                    <p className="text-xl">SCORE: {score}</p>
                    <p className="text-xl">LEVEL: {level}</p>
                    <p className="text-xl">LINES: {lines}</p>
                </div>
                <ul className="flex flex-col gap-4 w-full">
                    <li>
                        <GameOverBTN label="New Game" />
                    </li>
                    <li>
                        <GameOverBTN to="/rank" label="Rank" />
                    </li>
                    <li>
                        <GameOverBTN to="/listscore" label="List Score" />
                    </li>
                    <li>
                        <GameOverBTN to="/home" label="Home" />
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default GameOver;

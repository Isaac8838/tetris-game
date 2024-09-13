import { useDispatch, useSelector } from "react-redux";
import GameOverBTN from "./GameOverBTN";
import { useEffect } from "react";
import { handleSubmitRecord } from "./TetrisSlice";
import { useReady } from "./useReady";

const GameOver = () => {
    const { score, level, lines } = useSelector((state) => state.tetris.stats);

    const { setReady } = useReady();

    const alreadySendRecord = useSelector(
        (state) => state.tetris.alreadySendRecord,
    );

    const dispatch = useDispatch();

    useEffect(() => {
        setReady(false);
        if (!alreadySendRecord) {
            dispatch(handleSubmitRecord());
        }
    }, [alreadySendRecord, dispatch, setReady]);

    return (
        <div className="fixed left-0 top-0 flex h-full w-full items-center backdrop-blur-md">
            <div className="mx-auto flex w-64 flex-col gap-8">
                <div className="rounded-full bg-custom-red_bg px-10 py-4 text-3xl font-semibold tracking-wider text-custom-orange_text">
                    Game Over
                </div>
                <div className="flex flex-col items-center gap-3">
                    <p className="text-2xl text-custom-white_text">
                        SCORE: {score}
                    </p>
                    <p className="text-2xl text-custom-white_text">
                        LEVEL: {level}
                    </p>
                    <p className="text-2xl text-custom-white_text">
                        LINES: {lines}
                    </p>
                </div>
                <ul className="flex w-full flex-col gap-4">
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

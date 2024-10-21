import { useDispatch, useSelector } from "react-redux";
import { FaCrown } from "react-icons/fa";
import { useOpponentDataContext } from "./OpponentDataContext";
import { reset } from "../Tetris/TetrisSlice";
import { useNavigate } from "react-router-dom";
const MultiplayerGameOver = () => {
    const { gameState, stats } = useSelector((state) => state.tetris);
    const { username } = useSelector((state) => state.user);

    const { opponentData } = useOpponentDataContext();
    const dispatch = useDispatch();

    const navigate = useNavigate();

    return (
        <div className="absolute left-1/2 top-12 -translate-x-1/2">
            <h2
                className={`mb-12 text-center text-6xl font-semibold tracking-wide ${gameState === 3 ? "text-custom-orange_text" : "text-red-600"}`}
            >
                {gameState === 3 && "You Win"}
                {gameState === 4 && "You Lose"}
                {gameState === 5 && "Draw"}
            </h2>
            <div className="flex overflow-hidden rounded-2xl text-white shadow-2xl">
                <div className="bg-custom-blue1_bg flex flex-1 flex-col items-center gap-6 px-16 py-6">
                    <div className="flex flex-col items-center">
                        <span className="aspect-square w-8">
                            {gameState === 3 && (
                                <FaCrown className="h-full w-full text-custom-orange_text" />
                            )}
                        </span>
                        <h3 className="text-4xl font-semibold tracking-wide">
                            {username}
                        </h3>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-3xl">
                        <p>Score: {stats.score}</p>
                        <p>Lines: {stats.lines}</p>
                        <p>Level: {stats.level}</p>
                    </div>
                    <button
                        className={`w-40 rounded-full ${opponentData?.gameState === 1 ? "bg-gray-500" : "bg-green-500"} px-6 py-1 text-2xl shadow-xl`}
                        disabled={opponentData?.gameState === 1}
                        onClick={() => {
                            dispatch(reset());
                        }}
                    >
                        {opponentData?.gameState === 1 ? "Wait" : "Play Again"}
                    </button>
                </div>

                <div className="bg-custom-blue2_bg flex flex-1 flex-col items-center gap-6 px-16 py-6">
                    <div className="flex flex-col items-center">
                        <span className="aspect-square w-8">
                            {gameState === 4 && (
                                <FaCrown className="h-full w-full text-custom-orange_text" />
                            )}
                        </span>
                        <h3 className="text-4xl font-semibold tracking-wide">
                            {opponentData?.player || "Player2"}
                        </h3>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-3xl">
                        <p>Score: {opponentData.data.stats.score}</p>
                        <p>Lines: {opponentData.data.stats.lines}</p>
                        <p>Level: {opponentData.data.stats.level}</p>
                    </div>
                    <button
                        className="w-40 rounded-full bg-red-600 px-6 py-1 text-2xl shadow-xl"
                        onClick={() => navigate("/home")}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MultiplayerGameOver;

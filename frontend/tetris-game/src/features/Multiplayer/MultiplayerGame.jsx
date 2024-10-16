import P1Tetris from "./P1Tetris";
import P2Tetris from "./P2Tetris";
import MultiplayerGameOver from "./MultiplayerGameOver";
import { useSelector } from "react-redux";

const MultiplayerGame = () => {
    const { gameState } = useSelector((state) => state.tetris);

    return (
        <div className="relative m-auto grid h-[650px] w-[1200px] grid-cols-[1.5fr_0.7fr] gap-36">
            <P1Tetris />
            <P2Tetris />
            {gameState === 2 || gameState === 3 ? (
                <MultiplayerGameOver />
            ) : null}
        </div>
    );
};

export default MultiplayerGame;

import Board from "./Board";
import Controller from "./Controller";
import TetrisPreviews from "./TetrisPreviews";
import Stats from "./Stats";
import { useSelector } from "react-redux";
import GameOver from "./GameOver";
import TetrominoSave from "./TetrominoSave";
import ReadyButton from "./ReadyButton";

const Tetris = () => {
    const { isGameOver } = useSelector((state) => state.tetris);
    const { gameState } = useSelector((state) => state.tetris);

    return (
        <>
            <div className="relative m-auto box-content aspect-[1/2] h-[650px]">
                <Board />

                <TetrisPreviews />
                <TetrominoSave />
                <Stats />
                {gameState === 0 && <ReadyButton />}
                {gameState === 1 && <Controller />}
            </div>
            {isGameOver && <GameOver />}
        </>
    );
};

export default Tetris;

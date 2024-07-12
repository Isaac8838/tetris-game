import Board from "./Board";
import Controller from "./Controller";
import TetrisPreviews from "./TetrisPreviews";
import Stats from "./Stats";
import { useSelector } from "react-redux";
import GameOver from "./GameOver";
import TetrominoSave from "./TetrominoSave";

const Tetris = () => {
    const isGameOver = useSelector((state) => state.tetris.isGameOver);
    return (
        <>
            <div className="h-[80%] max-h-[650px] min-h-[480px] aspect-[1/2] m-auto border-4 border-violet-600 box-content rounded-md relative">
                <Board />
                <TetrisPreviews />
                <TetrominoSave />
                <Stats />
                <Controller />
            </div>
            {isGameOver && <GameOver />}
        </>
    );
};

export default Tetris;

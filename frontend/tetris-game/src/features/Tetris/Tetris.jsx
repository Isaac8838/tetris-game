import Board from "./Board";
import Controller from "./Controller";
import TetrisPreviews from "./TetrisPreviews";
import Stats from "./Stats";
import { useSelector } from "react-redux";
import GameOver from "./GameOver";
import TetrominoSave from "./TetrominoSave";
import ReadyButton from "./ReadyButton";
import { useReady } from "./useReady";

const Tetris = () => {
    const { isGameOver } = useSelector((state) => state.tetris);
    const { ready } = useReady();

    return (
        <>
            <div className="relative m-auto box-content aspect-[1/2] h-[650px]">
                <Board />

                <TetrisPreviews />
                <TetrominoSave />
                <Stats />
                {!ready && <ReadyButton />}
                {ready && <Controller />}
            </div>
            {isGameOver && <GameOver />}
        </>
    );
};

export default Tetris;

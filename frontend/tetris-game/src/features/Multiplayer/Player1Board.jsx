import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateBoard } from "../Tetris/TetrisSlice";
import BoardCell from "../Tetris/BoardCell";

const Player1Board = () => {
    const { board, tetromino } = useSelector((state) => state.tetris);
    const { gameState } = useSelector((state) => state.tetris);

    const boardStyle = {
        gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`,
    };

    const dispatch = useDispatch();

    useEffect(() => {
        if (gameState === 1) {
            dispatch(updateBoard(tetromino));
        }
    }, [tetromino, dispatch, gameState]);

    return (
        <div
            className="grid h-full gap-[2px] overflow-hidden rounded-2xl border-4 border-custom-purple_border bg-custom-purple_content"
            style={boardStyle}
        >
            {gameState >= 1 &&
                board.rows.map((columns, y) =>
                    columns.map((cell, x) => (
                        <BoardCell key={`${y}-${x}`} cell={cell}></BoardCell>
                    )),
                )}
        </div>
    );
};

export default Player1Board;

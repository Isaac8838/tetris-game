import { useDispatch, useSelector } from "react-redux";
import BoardCell from "./BoardCell";
import { useEffect } from "react";
import { updateBoard } from "./TetrisSlice";
import { useReady } from "./useReady";

const Board = () => {
    const { board, tetromino } = useSelector((state) => state.tetris);

    const { ready } = useReady();

    const boardStyle = {
        gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`,
    };

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateBoard(tetromino));
    }, [tetromino, dispatch]);

    return (
        <div
            className="grid h-full gap-[2px] overflow-hidden rounded-2xl border-4 border-custom-purple_border bg-custom-purple_content"
            style={boardStyle}
        >
            {ready &&
                board.rows.map((columns, y) =>
                    columns.map((cell, x) => (
                        <BoardCell key={`${y}-${x}`} cell={cell}></BoardCell>
                    )),
                )}
        </div>
    );
};

export default Board;

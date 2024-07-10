import { useDispatch, useSelector } from "react-redux";
import BoardCell from "./BoardCell";
import { useEffect } from "react";
import { updateBoard } from "./TetrisSlice";
import useController from "./useController";

const Board = () => {
    const { board, tetromino } = useSelector((state) => state.tetris);
    const boardStyle = {
        gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`,
    };

    const dispatch = useDispatch();

    //控制
    // useController();

    useEffect(() => {
        dispatch(updateBoard(tetromino));
    }, [tetromino, dispatch]);

    return (
        <div
            className="h-full grid gap-[2px]  bg-violet-950"
            style={boardStyle}
        >
            {board.rows.map((columns, y) =>
                columns.map((cell, x) => (
                    <BoardCell key={`${y}-${x}`} cell={cell}></BoardCell>
                )),
            )}
        </div>
    );
};

export default Board;

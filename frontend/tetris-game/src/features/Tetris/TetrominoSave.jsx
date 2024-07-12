import { useSelector } from "react-redux";
import { buildBoard, transferToBoard } from "utils/Board";
import BoardCell from "./BoardCell";

const TetrominoSave = () => {
    const tetromino = useSelector(
        (state) => state.tetris.hold_tetromino.tetromino,
    );

    let preview_board = null;

    if (tetromino) {
        console.log(tetromino);
        preview_board = transferToBoard({
            rows: buildBoard(4, 4).rows,
            tetromino: tetromino.tetromino,
            position: { row: 0, column: 0 },
            collide: false,
        });
    }
    console.log(preview_board);
    // console.log(tetromino);
    return (
        <div className=" absolute right-[110%] top-0 max-h-[350px] h-[16%] aspect-square border-4 border-violet-600 grid grid-cols-4 grid-rows-4 rounded-md box-content gap-[2px] bg-violet-950">
            {preview_board?.map((row, y) =>
                row.map((cell, x) => (
                    <BoardCell key={y * row.length + x} cell={cell}></BoardCell>
                )),
            )}
        </div>
    );
};
export default TetrominoSave;

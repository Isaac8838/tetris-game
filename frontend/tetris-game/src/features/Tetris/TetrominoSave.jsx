import { useSelector } from "react-redux";
import { buildBoard, transferToBoard } from "@/utils/Board";
import BoardCell from "./BoardCell";
import { useReady } from "./useReady";

const TetrominoSave = () => {
    const hold_tetromino = useSelector(
        (state) => state.tetris.hold_tetromino.tetromino,
    );

    const { ready } = useReady();

    let preview_board = null;

    if (hold_tetromino) {
        preview_board = transferToBoard({
            rows: buildBoard(4, 4).rows,
            tetromino: hold_tetromino.tetromino,
            position: { row: 0, column: 0 },
            collide: false,
        });
    }

    return (
        <div className="absolute right-[110%] top-0 box-content grid aspect-square h-[16%] max-h-[350px] grid-cols-4 grid-rows-4 gap-[2px] rounded-lg border-4 border-custom-purple_border bg-custom-purple_content">
            {ready &&
                preview_board?.map((row, y) =>
                    row.map((cell, x) => (
                        <BoardCell
                            key={y * row.length + x}
                            cell={cell}
                        ></BoardCell>
                    )),
                )}
        </div>
    );
};
export default TetrominoSave;

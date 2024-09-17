import { buildBoard, transferToBoard } from "@/utils/Board";
import { TETROMINOES } from "@/utils/Tetromino";
import BoardCell from "../Tetris/BoardCell";

const SkinPreviews = () => {
    const TETROMINOES_ARR = Object.values(TETROMINOES);
    return (
        <div className="grid min-w-[240px] grid-cols-2 grid-rows-4 gap-4">
            {TETROMINOES_ARR.map((tetromino) => {
                const emptyBoard = buildBoard(4, 4);
                const board = transferToBoard({
                    rows: emptyBoard.rows,
                    tetromino,
                    collide: false,
                    position: { row: 1, column: 0 },
                });

                return (
                    <div
                        className="grid aspect-square h-28 grid-cols-4 grid-rows-4 gap-[2px] rounded-xl bg-custom-purple_content p-1"
                        key={tetromino.className}
                    >
                        {board.map((row, y) =>
                            row.map((cell, x) => (
                                <BoardCell
                                    key={`${tetromino.className}-${y}-${x}`}
                                    cell={cell}
                                />
                            )),
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SkinPreviews;

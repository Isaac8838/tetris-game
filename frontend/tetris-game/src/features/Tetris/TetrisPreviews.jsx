import { useSelector } from "react-redux";
import BoardCell from "./BoardCell";
import { buildBoard, transferToBoard } from "@/utils/Board";

const TetrisPreviews = () => {
    const tetrominoes = useSelector((state) => state.tetris.tetrominoes);

    return (
        <div className="absolute left-[110%] top-0 flex aspect-[1/3.4] h-[55%] max-h-[350px] flex-col gap-5">
            <TetrisPreview tetromino={tetrominoes[3]} />
            <TetrisPreview tetromino={tetrominoes[2]} />
            <TetrisPreview tetromino={tetrominoes[1]} />
        </div>
    );
};

const TetrisPreview = ({ tetromino }) => {
    const { gameState } = useSelector((state) => state.tetris);

    let preview_board = buildBoard(4, 4);

    if (gameState !== 0 && tetromino !== undefined) {
        preview_board = transferToBoard({
            rows: preview_board.rows,
            tetromino,
            position: { row: 0, column: 0 },
            collide: false,
        });
    } else {
        preview_board = preview_board.rows;
    }

    return (
        <div className="box-content grid aspect-square h-[33%] w-[80%] grid-cols-4 grid-rows-4 gap-[2px] overflow-hidden rounded-lg border-4 border-custom-purple_border bg-custom-purple_content">
            {gameState >= 1 &&
                preview_board.map((row, y) =>
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

export default TetrisPreviews;

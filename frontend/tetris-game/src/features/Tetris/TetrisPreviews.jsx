import { useSelector } from "react-redux";
import BoardCell from "./BoardCell";
import { buildBoard, transferToBoard } from "utils/Board";

const TetrisPreviews = () => {
    const tetrominoes = useSelector((state) => state.tetris.tetrominoes);
    return (
        <div className="absolute top-[-4px] left-[110%] flex flex-col gap-5 max-h-[350px] h-[55%] aspect-[1/3.4]">
            <TetrisPreview tetromino={tetrominoes[3]} />
            <TetrisPreview tetromino={tetrominoes[2]} />
            <TetrisPreview tetromino={tetrominoes[1]} />
        </div>
    );
};

const TetrisPreview = ({ tetromino }) => {
    let preview_board = buildBoard(4, 4);
    preview_board = transferToBoard({
        rows: preview_board.rows,
        tetromino,
        position: { row: 0, column: 0 },
        collide: false,
    });

    return (
        <div className="h-[33%] w-[80%] aspect-square border-4 border-violet-600 grid grid-cols-4 grid-rows-4 rounded-md box-content gap-[2px] bg-violet-950">
            {preview_board.map((row, y) =>
                row.map((cell, x) => (
                    <BoardCell key={y * row.length + x} cell={cell}></BoardCell>
                )),
            )}
        </div>
    );
};

export default TetrisPreviews;

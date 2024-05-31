import "./index.css";

//import utils
import { buildBoard, transferToBoard } from "utils/Board";

//import compoenet
import BoardCell from "pages/Game/BoardCell";

const Preview = ({ tetromino, index }) => {
    let preview_board = buildBoard(4, 4);
    const previewBoardTop = { top: `${index * 120}px` };
    // console.log(tetromino);
    preview_board = transferToBoard({
        rows: preview_board.rows,
        tetromino,
        position: { row: 0, column: 0 },
        collide: false,
    });

    return (
        <div className="previewBoard" style={previewBoardTop}>
            {preview_board.map((row, y) =>
                row.map((cell, x) => (
                    <BoardCell key={y * row.length + x} cell={cell}></BoardCell>
                ))
            )}
        </div>
    );
};

export default Preview;

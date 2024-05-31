import "./index.css";

//import component
import BoardCell from "pages/Game/BoardCell";

const Board = ({ board }) => {
    const boardStyle = {
        gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`,
    };

    return (
        <div className="board" style={boardStyle}>
            {board.rows.map((columns, y) =>
                columns.map((cell, x) => (
                    <BoardCell key={`${y}-${x}`} cell={cell}></BoardCell>
                ))
            )}
        </div>
    );
};

export default Board;

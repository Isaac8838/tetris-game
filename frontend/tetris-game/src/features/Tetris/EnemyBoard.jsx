import { buildBoard } from "@/utils/Board";
import BoardCell from "./BoardCell";

//initial state
const board = buildBoard(10, 20);

const EnemyBoard = () => {
    const boardStyle = {
        gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`,
    };

    return (
        <div
            className="grid h-full gap-[2px] overflow-hidden rounded-2xl border-4 border-custom-purple_border bg-custom-purple_content"
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

export default EnemyBoard;

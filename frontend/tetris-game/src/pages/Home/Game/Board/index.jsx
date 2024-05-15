import {BoardCell} from 'pages/Home/Game/BoardCell'

import './index.css'

const Board = ({board}) => {
    // 設定寬高
    const boardStyles = {
        // 設定有幾行，每行高度都是1fr
        gridTemplateRows: `repeat(${board.size.rows}), 1fr`,
        // 設定有幾列，每列寬度都是1fr
        gridTemplateColumns: `repeat(${board.size.columns} , 1fr)`
    }
    return (
        <div className="Board" style={boardStyles}>
            {board.rows.map((row,y) => 
                row.map((cell,x) => (
                    <BoardCell key={y * board.size.columns + x} cell={cell}/>
                ))
            )}
        </div>
    )
};

export default Board;
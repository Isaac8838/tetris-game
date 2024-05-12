export const transferToBoard = ({
    className,
    isOccupied,
    position,
    rows,
    shape
}) => {
    shape.forEach((row ,y) =>{
        row.forEach((cell,x) =>{
            if (cell){
                const occupied = isOccupied;
                const _y = y + position.row;
                const _x = x + position.column;
                row[_y][_x] = {occupied,className};
            }
        })
    })
    return rows;
}

///////////寫到這1:05:08
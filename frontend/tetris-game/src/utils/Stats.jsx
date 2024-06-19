export const calculateScore = (player, clearLine, rows) => {
    let score = 0;

    //一次消幾行
    switch (clearLine) {
        case 1:
            score = 100;
            break;
        case 2:
            score = 300;
            break;
        case 3:
            score = 500;
            break;
        case 4:
            score = 800;
            break;
        default:
            break;
    }

    // 如果是T轉(分數成1.5)
    if (isTspin({ ...player, rows })) {
        console.log("T轉");
        score *= 1.5;
    }

    return score;
};

const isTspin = ({ position, tetromino, rows }) => {
    const T_croner = [
        { row: position.row, column: position.column },
        { row: position.row, column: position.column + 2 },
        { row: position.row + 2, column: position.column },
        { row: position.row + 2, column: position.column + 2 },
    ];

    let occupiedCorners = 0;

    // 看4個角落有沒有方塊
    T_croner.forEach((corner) => {
        if (
            rows[corner.row] &&
            rows[corner.row][corner.column] &&
            rows[corner.row][corner.column].occupied
        ) {
            occupiedCorners++;
        }
    });

    // T周邊有3個方塊(T轉)
    if (occupiedCorners >= 3) return true;
    return false;
};

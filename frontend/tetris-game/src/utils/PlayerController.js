// 是否撞到已放置的方塊
const isCollide = (shape, playerPosition, board) => {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const _y = playerPosition.row + y;
                const _x = playerPosition.column + x;
                if (
                    board.rows[_y] &&
                    board.rows[_y][_x] &&
                    board.rows[_y][_x].occupied
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

// 是否在Board裡面移動
const isWithinBoard = (shape, playerPosition, board) => {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const _y = playerPosition.row + y;
                const _x = playerPosition.column + x;

                if (
                    _x < 0 ||
                    _x >= board.size.columns ||
                    _y >= board.size.rows ||
                    _y < 0
                ) {
                    return false;
                }
            }
        }
    }
    return true;
};

export const MovePlayer = (vector, position, shape, board) => {
    // 計算下一步
    const newPosition = {
        column: position.column + vector.x,
        row: position.row + vector.y,
    };
    // 檢查移動後是否在board裡面，有沒有撞到其他方塊
    const isOnBoard = isWithinBoard(shape, newPosition, board);
    const collided = isCollide(shape, newPosition, board);

    const preventMove = !isOnBoard || collided;
    const resultPosition = preventMove ? position : newPosition;

    // 檢查往下移動時是否碰到地
    const isMoveDown = vector.y > 0;
    const isHitBottom = isMoveDown && preventMove;

    return { collideBottom: isHitBottom, position: resultPosition };
};

export const attemptMove = ({ tetromino, board, key }) => {
    let vector = { x: 0, y: 0 };
    if (key === "ArrowLeft") vector.x--;
    if (key === "ArrowRight") vector.x++;
    if (key === "ArrowDown" || key === "AutoDown") vector.y++;

    const { collideBottom, position } = MovePlayer(
        vector,
        tetromino.position,
        tetromino.tetromino.shape,
        board,
    );

    if (collideBottom) {
        if (key === "AutoDown") {
            return [{ ...tetromino, collide: true }, true];
        }
        return [tetromino, false];
    } else {
        return [{ ...tetromino, position: position }, false];
    }
};

// 為了不直接修改player.tetromino.shape使用深拷貝
const deepCopy = (array) => array.map((row) => [...row]);

export const attemptRotate = ({ tetromino, board }) => {
    const copyShape = deepCopy(tetromino.tetromino.shape);
    const newShape = rotate(copyShape);
    const position = tetromino.position;

    // wall kick
    const offsets = [
        { x: 0, y: 0 }, // 不移動
        { x: -1, y: 0 }, // 向左移動1格
        { x: 1, y: 0 }, // 向右移動1格
        { x: 0, y: -1 }, // 向上移動1格
        { x: -2, y: 0 }, // 向左移動2格
        { x: 2, y: 0 }, // 向右移動2格
        { x: 0, y: -2 }, // 向上移動2格
        { x: -1, y: -1 }, // 左上移動1格
        { x: 1, y: -1 }, // 右上移動1格
        { x: -1, y: 1 }, // 左下移動1格
        { x: 1, y: 1 }, // 右下移動1格
    ];

    for (let offset of offsets) {
        const newPosition = {
            column: position.column + offset.x,
            row: position.row + offset.y,
        };

        const isOnBoard = isWithinBoard(newShape, newPosition, board);

        const collided = isCollide(newShape, newPosition, board);
        // 旋轉成功
        if (isOnBoard && !collided) {
            return {
                ...tetromino,
                tetromino: {
                    ...tetromino.tetromino,
                    shape: newShape,
                },
                position: newPosition,
            };
        }
    }

    //旋轉失敗
    return tetromino;
};

const rotate = (shape) => {
    const n = shape.length;

    //先轉置
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            [shape[i][j], shape[j][i]] = [shape[j][i], shape[i][j]];
        }
    }

    //反轉
    for (let i = 0; i < n; i++) {
        shape[i].reverse();
    }

    return shape;
};

// export const findGhostPosition = (player, board) => {
//     let ghostPosition = null;
//     for (let i = 0; i < 20; i++) {
//         // 尋找最下面掉落位置
//         const { collideBottom, position } = MovePlayer(
//             { x: 0, y: i },
//             player.position,
//             player.tetromino.shape,
//             board,
//         );
//         if (collideBottom) break;
//         ghostPosition = position;
//     }
//     return ghostPosition;
// };

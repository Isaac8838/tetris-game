export const PlayerController = ({
    action,
    player,
    setPlayer,
    board,
    resetPlayer,
    pauseDropTime,
    resumeDropTime,
}) => {
    if (action === "Rotate") {
        attemptRotate(player, board, setPlayer);
    }
    if (action === "Left" || action === "Right" || action === "SlowDrop") {
        attemptMove(player, setPlayer, board, action);
    }
    if (action === "FastDrop") {
        setPlayer({ ...player, collide: true, fastDorp: true });
    }

    if (action === "SlowDrop" || action === "FastDrop") {
        pauseDropTime();
    }
};

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

const MovePlayer = (vector, position, shape, board) => {
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

export const attemptMove = (player, setPlayer, board, action) => {
    let vector = { x: 0, y: 0 };
    if (action === "Left") vector.x--;
    if (action === "Right") vector.x++;
    if (action === "SlowDrop") vector.y++;

    const { collideBottom, position } = MovePlayer(
        vector,
        player.position,
        player.tetromino.shape,
        board
    );

    if (collideBottom) {
        tetrominoDone(player, setPlayer);
    } else {
        setPlayer({ ...player, position: position });
    }
};

// 為了不直接修改player.tetromino.shape使用深拷貝
const deepCopy = (array) => array.map((row) => [...row]);

const attemptRotate = (player, board, setPlayer) => {
    const copyShape = deepCopy(player.tetromino.shape);
    const newShape = rotate(copyShape);
    const position = player.position;

    // wall kick
    const offsets = [
        // 防止卡牆
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

        if (isOnBoard && !collided) {
            setPlayer({
                ...player,
                tetromino: {
                    ...player.tetromino,
                    shape: newShape,
                },
                position: newPosition,
            });

            return;
        }
    }
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

const tetrominoDone = (player, setPlayer) => {
    setPlayer({ ...player, collide: true });
};

export const findGhostPosition = (player, board) => {
    let ghostPosition = null;
    for (let i = 0; i < 20; i++) {
        // 尋找最下面掉落位置
        const { collideBottom, position } = MovePlayer(
            { x: 0, y: i },
            player.position,
            player.tetromino.shape,
            board
        );
        if (collideBottom) break;
        ghostPosition = position;
    }
    return ghostPosition;
};

import { defaultCell } from "./Cell";
import { MovePlayer } from "./PlayerController";

export const buildBoard = (columns, rows) => {
    const builtRows = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => ({ ...defaultCell })),
    );
    return {
        rows: builtRows,
        size: { columns, rows },
    };
};

export const nextBoard = ({ board, tetromino }) => {
    //複製board
    let rows = board.rows.map((row) =>
        row.map((cell) => (cell.occupied ? cell : { ...defaultCell })),
    );

    const ghostPosition = findGhostPosition({ tetromino, board });
    const { fastDrop } = tetromino;

    rows = transferToBoard({
        rows,
        tetromino: {
            className: fastDrop
                ? tetromino.tetromino.className
                : `${tetromino.tetromino.className}_ghost`,
            shape: tetromino.tetromino.shape,
        },
        position: ghostPosition,
        collide: fastDrop,
    });

    if (!fastDrop) {
        rows = transferToBoard({
            rows,
            tetromino: tetromino.tetromino,
            position: tetromino.position,
            collide: tetromino.collide,
        });
    }

    // 消除擺滿的行
    const blankRow = rows[0].map(() => ({ ...defaultCell }));
    let clearLine = 0;

    rows = rows.reduce((acc, row) => {
        if (row.every((column) => column.occupied)) {
            clearLine++;

            acc.unshift(blankRow);
        } else {
            acc.push(row);
        }
        return acc;
    }, []);

    return {
        newBoard: {
            rows,
            size: board.size,
        },
        clearLine,
    };
};

export const transferToBoard = ({
    rows,
    tetromino: Tetromino,
    collide,
    position,
}) => {
    // 深拷貝 rows
    const newRows = rows.map((row) => row.map((cell) => ({ ...cell })));

    Tetromino.shape.forEach((tetromino_rows, y) => {
        const _y = position.row + y;
        tetromino_rows.forEach((tetromino_cell, x) => {
            if (tetromino_cell) {
                const _x = position.column + x;
                newRows[_y][_x] = {
                    occupied: collide ? true : newRows[_y][_x].occupied,
                    className: Tetromino.className,
                };
            }
        });
    });

    return newRows;
};

// 檢查是不是生成在方塊上
export const detectDead = ({ tetromino, board }) => {
    if (!tetromino || !board) return false;

    const { tetromino: Tetromino, position } = tetromino;
    const { rows } = board;

    for (let y = 0; y < Tetromino.shape.length; y++) {
        const _y = position.row + y;
        for (let x = 0; x < Tetromino.shape[y].length; x++) {
            const tetromino_cell = Tetromino.shape[y][x];
            if (tetromino_cell) {
                const _x = position.column + x;
                if (rows[_y][_x].occupied) {
                    return true;
                }
            }
        }
    }

    return false;
};

export const findGhostPosition = ({ tetromino, board }) => {
    let ghostPosition = null;
    for (let i = 0; i < 20; i++) {
        // 尋找最下面掉落位置
        const { collideBottom, position } = MovePlayer(
            { x: 0, y: i },
            tetromino.position,
            tetromino.tetromino.shape,
            board,
        );
        if (collideBottom) break;
        ghostPosition = position;
    }
    return ghostPosition;
};

import { defaultCell } from "./Cell";
import { findGhostPosition } from "./PlayerController";

import { calculateScore } from "./Stats";

export const buildBoard = (columns, rows) => {
    const builtRows = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => ({ ...defaultCell }))
    );
    return {
        rows: builtRows,
        size: { columns, rows },
    };
};

export const nextBoard = ({ board, player, setStats }) => {
    //複製board
    let rows = board.rows.map((row) =>
        row.map((cell) => (cell.occupied ? cell : { ...defaultCell }))
    );

    // detectDead({ rows, player, setIsGameOver });

    const ghostPosition = findGhostPosition(player, board);

    const { fastDorp } = player;

    //如果是fastDrop直接把ghost變成tetris渲染，不是才渲染ghost
    rows = transferToBoard({
        rows,
        tetromino: {
            className: fastDorp
                ? player.tetromino.className
                : `${player.tetromino.className}_ghost`,
            shape: player.tetromino.shape,
        },
        position: ghostPosition,
        collide: fastDorp,
    });

    // 渲染tetris，但是fastDrop已經渲染過Tetris了就不再次渲染
    if (!fastDorp) {
        rows = transferToBoard({
            rows,
            ...player,
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

    // 計分
    if (clearLine > 0) {
        setStats((prevStats) => {
            const line = prevStats.line + clearLine;
            const level = 1 + Math.floor(line / 10);
            const score =
                calculateScore(player, clearLine, rows) + prevStats.score;
            return { score, level, line };
        });
    }

    return { rows, size: board.size };
};

export const transferToBoard = ({ rows, tetromino, position, collide }) => {
    tetromino.shape.map((tetromino_rows, y) => {
        const _y = position.row + y;
        tetromino_rows.map((tetromino_cell, x) => {
            if (tetromino_cell) {
                const _x = position.column + x;

                rows[_y][_x] = {
                    occupied: collide ? true : rows[_y][_x].occupied,
                    className: tetromino.className,
                };
            }
        });
    });
    return rows;
};

// 檢查是不是生成在方塊上
export const detectDead = ({ player, board }) => {
    if (!player || !board) return false;

    const { tetromino, position } = player;
    const { rows } = board;

    for (let y = 0; y < tetromino.shape.length; y++) {
        const _y = position.row + y;
        for (let x = 0; x < tetromino.shape[y].length; x++) {
            const tetromino_cell = tetromino.shape[y][x];
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

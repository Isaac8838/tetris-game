import seedrandom from "seedrandom";

const TETROMINOES = {
    I: {
        shape: [
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        className: "tetromino tetrominoI",
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        className: "tetromino tetrominoJ",
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        className: "tetromino tetrominoL",
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        className: "tetromino tetrominoO",
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        className: "tetromino tetrominoS",
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        className: "tetromino tetrominoT",
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        className: "tetromino tetrominoZ",
    },
};

const rng = seedrandom();

const randomTetromino = () => {
    const keys = Object.keys(TETROMINOES);
    const index = Math.floor(rng() * keys.length);
    return TETROMINOES[keys[index]];
};

export const generateTetrominoesArr = (preTetrominoes) => {
    //如果已經有Tetrominoes了
    if (preTetrominoes) {
        preTetrominoes.unshift(randomTetromino());
        return preTetrominoes;
    }

    //如果已經沒有Tetrominoes(遊戲一開始)生成5個
    const tetrominoes = Array(5)
        .fill(0)
        .map(() => randomTetromino());
    return tetrominoes;
};

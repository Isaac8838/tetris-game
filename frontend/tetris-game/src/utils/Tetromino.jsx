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

let tetromino_pool = [];

// const rng = seedrandom();

const randomTetromino = () => {
    const keys = Object.keys(TETROMINOES);
    // const index = Math.floor(rng() * keys.length);
    return TETROMINOES[keys[tetromino_pool.pop()]];
};

export const generateTetrominoesArr = (preTetrominoes) => {
    if (tetromino_pool.length === 0) {
        tetromino_pool = [
            ...generateTetrominoPool(),
            ...generateTetrominoPool(),
        ];
    }

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

function generateTetrominoPool() {
    const numbers = Array.from({ length: 7 }, (_, index) => index); // 產生 [0, 1, 2, 3, 4, 5, 6]
    return shuffle(numbers); // 隨機排列
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 交換元素
    }
    return array;
}

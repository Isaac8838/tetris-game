export const defaultCell = {
    occupied: false,
    className: "",
};

export const transferToWebsocketData = (rows) => {
    const data = rows.map((row) =>
        row.map((cell) => tetrominoClassEncode(cell.className)),
    );
    return data;
};

export const websocketDataToRows = (data) => {
    const rows = data.map((row) =>
        row.map((cell) => ({
            occupied: false,
            className: tetrominoClassDecode(cell),
        })),
    );
    return rows;
};

const tetrominoMap = {
    tetrominoI: 1,
    tetrominoJ: 2,
    tetrominoL: 3,
    tetrominoO: 4,
    tetrominoS: 5,
    tetrominoT: 6,
    tetrominoZ: 7,
};

const tetrominoClassEncode = (className) => {
    if (className && !className.includes("ghost")) {
        // 使用 Object.keys 遍歷 tetrominoMap 的鍵
        for (const key of Object.keys(tetrominoMap)) {
            if (className.includes(key)) {
                return tetrominoMap[key];
            }
        }
    }
    return 0;
};

const tetrominoClassDecode = (cell) => {
    if (cell !== 0) {
        for (const key of Object.keys(tetrominoMap)) {
            if (tetrominoMap[key] === cell) {
                return key;
            }
        }
    }
    return "";
};

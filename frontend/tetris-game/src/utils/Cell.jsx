export const defaultCell = {
    occupied: false,
    className: "",
};

export const transferToWebsocketData = (baord) => {
    const data = baord.rows.map((row) =>
        row.map((cell) => (cell.occupied ? 1 : 0)),
    );
    return data;
};

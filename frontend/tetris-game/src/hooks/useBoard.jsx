import { useDebugValue, useEffect, useState } from "react";

//import utils
import { buildBoard, nextBoard, detectDead } from "utils/Board";

export const useBoard = (
    columns,
    rows,
    player,
    resetPlayer,
    setStats,
    setIsGameOver
) => {
    const [board, setboard] = useState(buildBoard(columns, rows));

    useEffect(() => {
        const gameOver = detectDead({ board, player });
        if (gameOver) {
            setIsGameOver(true);
        }
    }, [board, player, setIsGameOver]);

    useEffect(() => {
        if (player) {
            setboard((previousBoard) => {
                const newBoard = nextBoard({
                    board: previousBoard,
                    player,
                    setStats,
                });
                return newBoard;
            });
            if (player.collide) {
                resetPlayer();
            }
        }
    }, [player, resetPlayer, setStats]);

    return [board, setboard];
};

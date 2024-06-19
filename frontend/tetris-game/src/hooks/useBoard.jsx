import { useEffect, useState } from "react";

//import utils
import { buildBoard, nextBoard, detectDead } from "utils/Board";

import { calculateScore } from "utils/Stats";
export const useBoard = (
    columns,
    rows,
    player,
    resetPlayer,
    setStats,
    setIsGameOver
) => {
    const [board, setBoard] = useState(buildBoard(columns, rows));
    const [pendingStats, setPendingStats] = useState(null);

    useEffect(() => {
        const gameOver = detectDead({ board, player });
        if (gameOver) {
            setIsGameOver(true);
        }
    }, [board, player, setIsGameOver]);

    useEffect(() => {
        if (player) {
            setBoard((previousBoard) => {
                const { rows, stats } = nextBoard({
                    board: previousBoard,
                    player,
                });

                if (stats) {
                    setPendingStats(stats);
                }

                return { ...previousBoard, rows };
            });
            if (player.collide) {
                resetPlayer();
            }
        }
    }, [player, resetPlayer, setStats]);

    useEffect(() => {
        if (pendingStats) {
            setStats((prevStats) => {
                const line = prevStats.line + pendingStats.clearLine;
                const level = 1 + Math.floor(line / 10);
                const score =
                    calculateScore(player, pendingStats.clearLine, board.rows) +
                    prevStats.score;
                return { score, level, line };
            });
            setPendingStats(null);
        }
    }, [pendingStats, setStats, player, board.rows]);

    return [board, setBoard];
};

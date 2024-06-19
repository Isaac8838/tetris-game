import { useCallback, useEffect, useState } from "react";

// import hook
import { useTetrominoes } from "./useTetrominoes";

export const usePlayer = () => {
    const [tetrominoes, getNextTetromino] = useTetrominoes();
    const [player, setPlayer] = useState(null);

    const resetPlayer = useCallback(() => {
        const newPlayerTetromino = getNextTetromino();
        setPlayer({
            tetromino: newPlayerTetromino,
            position: { column: 4, row: 0 },
            collide: false,
            fastDorp: false,
        });
    }, [getNextTetromino]);

    useEffect(() => {
        resetPlayer();
    }, [resetPlayer]);

    return [player, tetrominoes, setPlayer, resetPlayer];
};

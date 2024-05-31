import { useCallback, useEffect, useState } from 'react';

// import hook
import { useTetrominoes } from './useTetrominoes';

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
    }, [getNextTetromino, player]);

    useEffect(() => {
        resetPlayer();
    }, []);

    // 印出用;
    // useEffect(() => {
    //     console.log('useEffect', player);
    // }, [player]);

    return [player, tetrominoes, setPlayer, resetPlayer];
};

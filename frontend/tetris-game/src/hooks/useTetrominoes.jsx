import { useCallback, useState } from 'react';

import { generateTetrominoesArr } from 'utils/Tetromino';

export const useTetrominoes = () => {
    const [tetrominoes, setTetrominoes] = useState(generateTetrominoesArr());

    const getNextTetromino = useCallback(() => {
        const nextTetromino = tetrominoes.pop();
        setTetrominoes((prev) => {
            const newTetrominoes = generateTetrominoesArr(prev);
            return newTetrominoes;
        });
        return nextTetromino;
    }, [tetrominoes]);

    return [tetrominoes, getNextTetromino];
};

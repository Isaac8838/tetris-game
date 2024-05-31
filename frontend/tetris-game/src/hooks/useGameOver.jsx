const { useState } = require('react');

const useGameOver = () => {
    const [isGameOver, setIsGameOver] = useState(false);

    return [isGameOver, setIsGameOver];
};

export default useGameOver;

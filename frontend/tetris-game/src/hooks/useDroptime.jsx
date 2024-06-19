import { useState, useCallback, useEffect } from "react";

const defaultDropTime = 1000;
const minimumDropTime = 100;
const speedIncrement = 50;

export const useDropTime = ({ stats, isGameOver }) => {
    const [dropTime, setDropTime] = useState(defaultDropTime);
    const [previousDropTime, setPreviousDropTime] = useState(0);

    const pauseDropTime = useCallback(() => {
        setTimeout(() => setDropTime(previousDropTime), setDropTime * 0.5);
        setDropTime(null);
    }, [previousDropTime]);

    useEffect(() => {
        const speed = speedIncrement * (stats.level - 1);
        const newDropTime = Math.max(defaultDropTime - speed, minimumDropTime);

        if (isGameOver) {
            setDropTime(null);
            return;
        }

        setDropTime(newDropTime);
        setPreviousDropTime(newDropTime);
    }, [stats.level, setDropTime, isGameOver]);

    return [dropTime, pauseDropTime];
};

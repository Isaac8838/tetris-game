import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

const defaultDropTime = 1000;
const minimumDropTime = 100;
const speedIncrement = 50;

export const useDropTime = () => {
    const level = useSelector((state) => state.tetris.stats.level);

    const [dropTime, setDropTime] = useState(defaultDropTime);
    const [previousDropTime, setPreviousDropTime] = useState(defaultDropTime);

    const pauseDropTime = useCallback(() => {
        // setPreviousDropTime(dropTime);
        setDropTime(null);
        setTimeout(() => {
            setDropTime(previousDropTime);
        }, 20); // 這裡可以根據實際需求調整時間
    }, [previousDropTime]);

    useEffect(() => {
        const newDropTime = Math.max(
            defaultDropTime - speedIncrement * (level - 1),
            minimumDropTime,
        );

        setDropTime(newDropTime);
        setPreviousDropTime(newDropTime);
    }, [level]);

    return [dropTime, pauseDropTime];
};

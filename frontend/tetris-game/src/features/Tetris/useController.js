import { useDropTime } from "hooks/useDroptime";
import useInterval from "hooks/useInterval";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleAutoDown, handleKeyPress } from "./TetrisSlice";

const isAvailableKey = (key) => {
    return (
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === " "
    );
};

const useController = () => {
    const dispatch = useDispatch();

    // 自動下降
    const [dropTime, pauseDropTime] = useDropTime();
    const callback = () => {
        dispatch(handleKeyPress("AutoDown"));
    };
    useInterval({ callback, delay: dropTime });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isAvailableKey(event.key)) {
                if (event.key === " " || event.key === "ArrowDown")
                    pauseDropTime();
                dispatch(handleKeyPress(event.key));
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [dispatch, pauseDropTime]);
};

export default useController;

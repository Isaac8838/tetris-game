import { useRef, useEffect, useCallback } from "react";

const useConnectionTimeout = (onTimeout, timeoutDuration = 5000) => {
    const timeoutRef = useRef(null);

    const clearConnectionTimeout = () => {
        if (timeoutRef.current) {
            // console.log("清空");
            clearTimeout(timeoutRef.current);
        }
    };

    const resetConnectionTimeout = useCallback(() => {
        // console.log("重置");
        clearConnectionTimeout();
        // 設置一個新的計時器
        timeoutRef.current = setTimeout(onTimeout, timeoutDuration);
    }, [onTimeout, timeoutDuration]);

    useEffect(() => {
        return () => {
            clearConnectionTimeout();
        };
    }, []);

    return { resetConnectionTimeout, clearConnectionTimeout };
};

export default useConnectionTimeout;

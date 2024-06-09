import { actionForKey } from "utils/Input";
const { useState, useEffect, useRef } = require("react");

export const usePlayerController = () => {
    const [keyCodes, setKeyCodes] = useState([]);
    const actionRef = useRef({ action: null, interval: null });

    const handleKeyDown = (event) => {
        const action = actionForKey(event.code);
        if (action) {
            // if (actionRef.current.action !== action) {
            //     actionRef.current.action = action;
            //     setKeyCodes((prev) => [...prev, action]);

            //     if (action === "Right" || action === "Left") {
            //         clearInterval(actionRef.current.interval);
            //         actionRef.current.interval = setInterval(() => {
            //             setKeyCodes((prev) => [...prev, action]);
            //         }, 150);
            //     }
            // }
            setKeyCodes((prev) => [...prev, action]);
        }
    };

    // const handleKeyUp = (event) => {
    //     const action = actionForKey(event.code);
    //     if (action) {
    //         if (action === actionRef.current.action) {
    //             clearInterval(actionRef.current.interval);
    //             actionRef.current = { action: null, interval: null };
    //         }
    //     }
    // };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        // document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            // document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return [keyCodes, setKeyCodes];
};

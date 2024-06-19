import { actionForKey } from "utils/Input";
const { useState, useEffect } = require("react");

export const usePlayerController = () => {
    const [keyCodes, setKeyCodes] = useState([]);

    const handleKeyDown = (event) => {
        const action = actionForKey(event.code);
        if (action) {
            setKeyCodes((prev) => [...prev, action]);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return [keyCodes, setKeyCodes];
};

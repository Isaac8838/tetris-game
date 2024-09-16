import { createContext, useContext, useState } from "react";

const readyContext = createContext();

export const ReadyProvider = ({ children }) => {
    const [ready, setReady] = useState(false);

    return (
        <readyContext.Provider value={{ ready, setReady }}>
            {children}
        </readyContext.Provider>
    );
};

export const useReady = () => {
    const context = useContext(readyContext);

    if (!context) {
        throw new Error("useReady must be used within a ReadyProvider");
    }

    return context;
};

import { createContext, useContext } from "react";

const MultiplayerDataContext = createContext();

const MultiplayerDataProvider = ({ children, receiveData }) => {
    return (
        <MultiplayerDataContext.Provider value={{ receiveData }}>
            {children}
        </MultiplayerDataContext.Provider>
    );
};

export const useMultiplayerDataContext = () => {
    const context = useContext(MultiplayerDataContext);

    if (!context) {
        throw new Error(
            "useMultiplayerDataContext must be used within a MultiplayerDataProvider",
        );
    }
    return context;
};

export default MultiplayerDataProvider;

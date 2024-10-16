import { createContext, useContext, useReducer } from "react";
import {
    opponentDataReducer,
    opponentDatainitialState,
} from "./opponentDataReducer";

const MultiplayerDataContext = createContext();

const OpponentDataProvider = ({ children }) => {
    const [opponentData, opponentDispatch] = useReducer(
        opponentDataReducer,
        opponentDatainitialState,
    );

    return (
        <MultiplayerDataContext.Provider
            value={{ opponentData, opponentDispatch }}
        >
            {children}
        </MultiplayerDataContext.Provider>
    );
};

export const useOpponentDataContext = () => {
    const context = useContext(MultiplayerDataContext);

    if (!context) {
        throw new Error(
            "useMultiplayerDataContext must be used within a MultiplayerDataProvider",
        );
    }
    return context;
};

export default OpponentDataProvider;

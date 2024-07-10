import userReducer from "./features/User/userSlice";
import tetrisReducer from "./features/Tetris/TetrisSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        user: userReducer,
        tetris: tetrisReducer,
    },
});

export default store;

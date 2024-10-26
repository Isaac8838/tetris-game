import Tetris from "@/features/Tetris/Tetris";
import { reset } from "@/features/Tetris/TetrisSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Game = () => {
    const dispatch = useDispatch();

    // Reset the game when the component unmounts
    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    return <Tetris />;
};
export default Game;

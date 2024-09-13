import Tetris from "@/features/Tetris/Tetris";
import { ReadyProvider } from "@/features/Tetris/useReady";

const Game = () => {
    return (
        <ReadyProvider>
            <Tetris />
        </ReadyProvider>
    );
};
export default Game;

import EnemyBoard from "@/features/Tetris/EnemyBoard";
import Tetris from "@/features/Tetris/Tetris";
import { ReadyProvider } from "@/features/Tetris/useReady";

const MultiplayerGame = () => {
    return (
        <ReadyProvider>
            <div className="m-auto grid h-[650px] w-[1200px] grid-cols-[1.5fr_0.7fr] gap-36">
                <div>
                    <Tetris />
                </div>
                <div>
                    <EnemyBoard />
                </div>
            </div>
        </ReadyProvider>
    );
};

export default MultiplayerGame;

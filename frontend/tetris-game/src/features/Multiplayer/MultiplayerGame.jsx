import EnemyBoard from "@/features/Tetris/EnemyBoard";
import Tetris from "@/features/Tetris/Tetris";
import { ReadyProvider } from "@/features/Tetris/useReady";
import { useMultiplayerDataContext } from "./useMultiplayerDataContext";

const MultiplayerGame = () => {
    const { receiveData } = useMultiplayerDataContext();
    console.log("收到", receiveData);
    return (
        <ReadyProvider>
            <div className="m-auto grid h-[650px] w-[1200px] grid-cols-[1.5fr_0.7fr] gap-36">
                <div>
                    <Tetris />
                    <div className="flex justify-center">aaa</div>
                </div>
                <div>
                    <EnemyBoard />
                    <div className="flex justify-center">aaa</div>
                </div>
            </div>
        </ReadyProvider>
    );
};

export default MultiplayerGame;

import P1Tetris from "./P1Tetris";
import P2Tetris from "./P2Tetris";

const MultiplayerGame = () => {
    return (
        <div className="m-auto grid h-[650px] w-[1200px] grid-cols-[1.5fr_0.7fr] gap-36">
            <P1Tetris />
            <P2Tetris />
        </div>
    );
};

export default MultiplayerGame;

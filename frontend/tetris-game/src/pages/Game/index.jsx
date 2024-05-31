import "./index.css";

import Tetris from "pages/Game/Tetris";
import GameOverMenu from "pages/Game/GameOverMenu";

import useGameOver from "hooks/useGameOver";

import { useStats } from "hooks/useStats";
import { useEffect } from "react";

const Game = () => {
    const [isGameOver, setIsGameOver] = useGameOver();
    const [stats, setStats] = useStats();

    // 遊戲頁面不要滑動
    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <>
            <Tetris
                columns={10}
                rows={20}
                isGameOver={isGameOver}
                setIsGameOver={setIsGameOver}
                stats={stats}
                setStats={setStats}
            ></Tetris>
            {isGameOver && <GameOverMenu stats={stats}></GameOverMenu>}
        </>
    );
};

export default Game;

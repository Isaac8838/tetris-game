import { useContext, useEffect } from "react";

import "./index.css";

import Tetris from "pages/Game/Tetris";
import GameOverMenu from "pages/Game/GameOverMenu";

import useGameOver from "hooks/useGameOver";
import { useStats } from "hooks/useStats";

import { AuthContext } from "contexts/AuthContext";

import { createScoreAPI } from "WebAPI";

const Game = () => {
    const [isGameOver, setIsGameOver] = useGameOver();
    const [stats, setStats] = useStats();

    const { authState, checkAndRenewToken } = useContext(AuthContext);
    // 遊戲頁面不要滑動
    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    useEffect(() => {
        if (!isGameOver) return;
        const sendScore = async () => {
            if (checkAndRenewToken()) {
                try {
                    const response = await createScoreAPI(
                        stats,
                        authState.accessToken
                    );
                    console.log("Score submitted successfully:", response);
                } catch (error) {
                    console.error("send score error:", error);
                }
            }
        };
        sendScore();
    }, [isGameOver, authState.accessToken, checkAndRenewToken, stats]);

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

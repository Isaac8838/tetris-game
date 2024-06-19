import React from "react";

import "./index.css";

// import hook
import { useBoard } from "hooks/useBoard";
import { usePlayer } from "hooks/usePlayer";

//import component
import TetrisContainer from "component/TetrisContainer";

//import pages component
import Board from "pages/Game/Board";
import Previews from "pages/Game/Previews";
import Stats from "pages/Game/Stats";
import GameController from "pages/Game/GameController";

const Tetris = ({
    columns,
    rows,
    isGameOver,
    setIsGameOver,
    stats,
    setStats,
}) => {
    //創建player hook
    const [player, tetrominoes, setPlayer, resetPlayer] = usePlayer();
    // 創建計分板

    //創建board hook，把player傳進去渲染到board上
    const [board] = useBoard(
        columns,
        rows,
        player,
        resetPlayer,
        setStats,
        setIsGameOver
    );

    return (
        <TetrisContainer>
            {/* 將hook的board傳入component的Board來創建Board */}
            <Board board={board} setStats={setStats}></Board>
            <Previews tetrominoes={tetrominoes}></Previews>
            <Stats stats={stats}></Stats>
            <GameController
                player={player}
                setPlayer={setPlayer}
                board={board}
                resetPlayer={resetPlayer}
                stats={stats}
                isGameOver={isGameOver}
            ></GameController>
        </TetrisContainer>
    );
};

export default Tetris;

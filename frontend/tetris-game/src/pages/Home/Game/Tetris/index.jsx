import React from 'react'

import Board from 'pages/Home/Game/Board'
import GameStats from 'pages/Home/Game/GameStats'
import Previews from 'pages/Home/Game/Previews'
import GameController from 'pages/Home/Game/GameController'

import { useBoard } from 'hooks/useBoard'
import { useGameStats } from 'hooks/useGameStats'
import { usePlayer} from 'hooks/usePlayer'

import './index.css'

const Tetris = ({rows,columns,setGameOver}) => {
    // send row and column to create board
    const [gameStats , addLinesCleared] = useGameStats();
    const[player , setPlayer , resetPlayer] = usePlayer();
    const [board,setboard] = useBoard({
        rows,
        columns,
        player,
        resetPlayer,
        addLinesCleared
    });


    return(
        <div className='Tetris'>
            <Board board={board}></Board>
            <GameStats gameStats={gameStats}></GameStats>
            <Previews tetrominoes={player.tetrominoes}></Previews>
            <GameController
                board = {board}
                gameStats = {gameStats}
                player = {player}
                setGameOver = {setGameOver}
                setPlayer = {setPlayer}
            />
        </div>
    )
}

export default Tetris
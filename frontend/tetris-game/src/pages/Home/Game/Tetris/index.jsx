import React from 'react'

import Board from 'pages/Home/Game/Board'
import GameStats from 'pages/Home/Game/GameStats'


import { useBoard } from 'hooks/useBoard'
import { useGameStats } from 'hooks/useGameStats'

import './index.css'

const Tetris = ({rows,columns}) => {
    // send row and column to create board
    const [board,setboard] = useBoard({rows,columns});
    
    const [gameStats , addLinesCleared] = useGameStats();

    return(
        <div className='Tetris'>
            <Board board={board}></Board>
            <GameStats gameStats={gameStats}></GameStats>
        </div>
    )
}

export default Tetris
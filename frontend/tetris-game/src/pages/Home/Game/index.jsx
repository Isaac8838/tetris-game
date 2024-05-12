import React from 'react'

import './index.css'

import Tetris from 'pages/Home/Game/Tetris'

import useGameOver from 'hooks/useGameOver'
const Game = () => {
  const [gameOver , setGameOver , resetGameOver] = useGameOver();

  return(
    <div className='game-container'>
      <Tetris rows={20} columns={10}></Tetris>
    </div>
  )
}

export default Game;
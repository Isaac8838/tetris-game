import React from 'react'
import "./index.css"
import { Link } from 'react-router-dom'


const Menu = () => {
  return(
    <>
      <h1 className='menu-header'>TETRIS</h1>
      <ul className='menu-ul'>
        <li><Link to='../game'>Start</Link></li>
        <li><Link to='../game'>Rank</Link></li>
        <li><Link to='../game'>Achieve</Link></li>
      </ul>
    </>
  )
}

export default Menu;
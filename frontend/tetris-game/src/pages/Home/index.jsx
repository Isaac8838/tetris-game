import React from 'react'
import "./index.css"
// import Menu from "./Menu"
import { Outlet } from 'react-router-dom'

const Home = () => {
    return(
      <div className='home-container-outline'>
        <div className='home-container'>
          <Outlet/>
        </div>
      </div>
    )
}

export default Home;
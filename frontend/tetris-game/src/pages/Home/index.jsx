import React, { Component } from 'react'
import "./index.css"
import Home_Link from "../../component/Home_Link"

export default class index extends Component {
  state = {
    home_link_path : {
      "login" : "#",
      "register" : "#",
      "rank" : "#"
    }
  }

  render() {
    const {home_link_path} = this.state

    //轉換成Array
    const home_link_path_arr = Object.entries(home_link_path);

    return (
      <div className='home-container-outline'>
        <div className='home-container'>
          <div className='home-content'>
            <h1 className='home-content-header'>TETRIS</h1>
            <ul>
              {home_link_path_arr.map((home_link_path) => {
                return(
                  <Home_Link key={home_link_path[0]} home_link_path={home_link_path}></Home_Link>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

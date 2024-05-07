import React, { Component } from 'react'
import "./index.css"
import HomeLink from "./HomeLink"

export default class index extends Component {
  state = {
    home_link_paths : [
      "start",
      "rank",
      "achievement"
    ]
  }

  render() {
    const {home_link_paths} = this.state

    return (
      <div className='home-container-outline'>
        <div className='home-container'>
          <div className='home-content'>
            <h1 className='home-content-header'>TETRIS</h1>
            <ul>
              {home_link_paths.map((home_link_path) => {
                return(
                  <li key={home_link_path}>
                    <HomeLink home_link_path={home_link_path}></HomeLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import "./index.css"
import { Link } from 'react-router-dom'
export default class extends Component {
  
  render() {
    const {home_link_path} = this.props
    return (
      <Link to={home_link_path[1]} className='link'>{home_link_path[0]}</Link>
    )
  }
}

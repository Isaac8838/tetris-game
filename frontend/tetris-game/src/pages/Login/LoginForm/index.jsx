import React, { Component } from 'react'
import {Link} from "react-router-dom"
import "./index.css"


export default class index extends Component {
  render() {
    return (
      <div className='login-from-container'>
        <form action="">
          <h1>Login</h1>
          <div className='input-box-danger'>
            <label htmlFor="username">Username</label>
            <input type='text' id='username' required/>
          </div>
          <div className='input-box-danger'>
            <label htmlFor="password">Password</label>
            <input type='password' id="password" required/>
          </div>
          <button type='submit' className='btn-danger'>sign in</button>
        </form>
        <Link to="/signup" className='link-danger'>sign up </Link>
      </div>
    )
  }
}

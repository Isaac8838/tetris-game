import React, { Component } from 'react'

import './index.css'

export default class index extends Component {
  render() {
    return (
      <div className='signup-container'>
        <h1>Sign up</h1>
        <form action="">
          <div className='input-box-danger'>
            <label>Username</label>
            <input type='text' id='username' required/>
          </div>
          <div className='input-box-danger'>
            <label>Password</label>
            <input type='password' id="password" required/>
          </div>
          <div className='input-box-danger'>
            <label>Repeat Password</label>
            <input type='password' id="repeat-password" required/>
          </div>
          <div className='input-box-danger'>
            <label>Email</label>
            <input type='email' id="email" required/>
          </div>
          <button type='submit' className='btn-danger'>Resgister</button>
        </form>
      </div>
    )
  }
}

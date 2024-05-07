import React, { Component } from 'react'
import LoginForm from './LoginForm'
import "./index.css"

export default class index extends Component {
  render() {
    return (
      <div className='login-container'>
        <div className='left-container'>
          <h2>Welcom</h2>
          <div className='content'>
            This is left-content
            This is left-content
            This is left-content
            This is left-content
            This is left-content
          </div>
        </div>
        <div className='right-container'>
          <LoginForm></LoginForm>
        </div>
      </div>
    )
  }
}

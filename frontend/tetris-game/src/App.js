import './App.css';
import {Component} from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"

//import page
import Home from "./pages/Home"
import Game from "./pages/Game"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

export default class App extends Component{
  render(){
    return(
      <div className='app'>
        {/* 註冊路遊 */}
        <BrowserRouter>
          <Routes>
            <Route index Component={Login}/>
            <Route path='/login' Component={Login}/>
            <Route path='/signup' Component={Signup}/>
            <Route path='/home' Component={Home}/>
            <Route path='/Game' Component={Game}/>
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
}
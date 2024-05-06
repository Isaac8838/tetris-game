import './App.css';
import {Component} from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"

//import page
import Home from "./pages/Home"
import Game from "./pages/Game"

export default class App extends Component{
  render(){
    return(
      <div className='app'>
        {/* 註冊路遊 */}
        <BrowserRouter>
          <Routes>
            <Route index Component={Home}/>
            <Route path='/home' Component={Home}/>
            <Route path='/Game' Component={Game}/>
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
}
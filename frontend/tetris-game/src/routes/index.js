import { Navigate } from 'react-router-dom'

import Login from '../pages/Login'
import LoginForm from '../pages/Login/LoginForm'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import Game from '../pages/Home/Game'
import Menu from '../pages/Home/Menu'

const routing_table = [
    {
        path:'/login',
        element:<Login/>,
        children:[
            {
                index:true,
                element:<Navigate to={'loginform'}/>
            },
            {
                path:'loginform',
                element:<LoginForm/>
            }
        ]
    },
    {
        path:'/signup',
        element:<Signup/>
    },
    {
        path:'/home',
        element:<Home/>,
        children:[
            {
                index:true,
                element:<Navigate to ={'menu'}/>
            },
            {
                path:'menu',
                element:<Menu/>
            },
            {
                path:'game',
                element:<Game/>
            }
            //還有ranke,achieve
        ]
    },
    {
        path:'/',
        element:<Navigate to='/login'/>
    }
]

export default routing_table;
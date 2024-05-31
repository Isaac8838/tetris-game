import { Navigate } from "react-router-dom";

import Login from "pages/Login";
import Signup from "pages/Signup";
import Home from "pages/Home";
import Game from "pages/Game";
import Menu from "pages/Home/Menu";

const routing_table = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/home",
        element: <Home />,
        children: [
            {
                index: true,
                element: <Navigate to={"menu"} />,
            },
            {
                path: "menu",
                element: <Menu />,
            },
            //還有ranke,achieve
        ],
    },
    {
        path: "/game",
        element: <Game />,
    },
    {
        path: "/",
        element: <Navigate to="/login" />,
    },
];

export default routing_table;

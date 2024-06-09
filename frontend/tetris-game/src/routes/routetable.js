import { Navigate } from "react-router-dom";

import Login from "pages/Login";
import LoginComponent from "pages/Login/LoginComponent";
import SignupComponent from "pages/Login/SignupComponent";
import Home from "pages/Home";
import Game from "pages/Game";
import Rank from "pages/Rank";
// import Menu from "pages/Home/Menu";

import PrivateRoute from "./PrivateRoute";

const routing_table = [
    {
        path: "/login",
        element: <Login />,
        children: [
            {
                index: true,
                element: <Navigate to={"loginComponent"} />,
            },
            {
                path: "loginComponent",
                element: <LoginComponent />,
            },
            {
                path: "signupComponent",
                element: <SignupComponent />,
            },
        ],
    },
    {
        path: "/home",
        element: (
            <PrivateRoute>
                <Home />
            </PrivateRoute>
        ),
    },
    {
        path: "/game",
        element: (
            <PrivateRoute>
                <Game />
            </PrivateRoute>
        ),
    },
    {
        path: "/rank",
        element: (
            <PrivateRoute>
                <Rank />
            </PrivateRoute>
        ),
    },
    {
        path: "/",
        element: <Navigate to="/login" />,
    },
];

export default routing_table;

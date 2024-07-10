import { Navigate } from "react-router-dom";

import Login from "pages/Login";
import LoginComponent from "pages/Login/LoginComponent";
import SignupComponent from "pages/Login/SignupComponent";
import Home from "pages/Home";
import Game from "pages/Game";
import Rank from "pages/Rank";
import ListScore from "pages/ListScore";
import Achieve from "pages/Achieve";

import PrivateRoute from "../utils/PrivateRoute";

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
        path: "/listScore",
        element: (
            <PrivateRoute>
                <ListScore />
            </PrivateRoute>
        ),
    },
    {
        path: "/achieve",
        element: (
            <PrivateRoute>
                <Achieve />
            </PrivateRoute>
        ),
    },
    {
        path: "/",
        element: <Navigate to="/login" />,
    },
    {
        path: "*",
        element: <p style={{ color: "white" }}>Page Not Found</p>,
    },
];

export default routing_table;

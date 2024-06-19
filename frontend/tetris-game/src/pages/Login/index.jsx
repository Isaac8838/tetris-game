import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import styles from "./index.module.scss";
import "scss/component.scss";
import { AuthContext } from "contexts/AuthContext";

const Login = () => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    if (authState.isAuthenticated) navigate("/home");
    return (
        <div className={styles["login-box"]}>
            <div className={styles["left-box"]}>
                <h2 className={styles["left-box__title"]}>Welcome</h2>
                <ul className={styles["left-box__list"]}>
                    <li>
                        <NavLink
                            to="/login/loginComponent"
                            className={({ isActive }) =>
                                isActive
                                    ? styles["left-box__navlink-active"]
                                    : styles["left-box__navlink"]
                            }
                        >
                            Login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/login/signupComponent"
                            className={({ isActive }) =>
                                isActive
                                    ? styles["left-box__navlink-active"]
                                    : styles["left-box__navlink"]
                            }
                        >
                            Register
                        </NavLink>
                    </li>
                </ul>
                <Outlet></Outlet>
            </div>

            <div className={styles["right-box"]}></div>
        </div>
    );
};

export default Login;

import { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { AuthContext } from "contexts/AuthContext";
import { Link } from "react-router-dom";

const SideNavBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarBackground, setSidebarBackground] = useState({ width: "0" });
    const [sidebarBox, setSidebarBox] = useState({ width: "0" });

    const { authState, logout } = useContext(AuthContext);

    const handleClickSidebarBTN = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleClickSignOut = () => {
        console.log("logout");
        logout();
    };

    useEffect(() => {
        if (sidebarOpen) {
            setSidebarBackground({ width: "100vw" });
            setSidebarBox({ width: "clamp(20vw,40rem,30vw)" });
        } else {
            setSidebarBackground({ width: "0" });
            setSidebarBox({ width: "0" });
        }
    }, [sidebarOpen]);

    return (
        <>
            <div
                className={styles["sidebar-background"]}
                style={sidebarBackground}
                onClick={handleClickSidebarBTN}
            ></div>

            <div className={styles["sidebar-box"]} style={sidebarBox}>
                <button
                    className={styles["sidebar-btn"]}
                    onClick={handleClickSidebarBTN}
                >
                    <div className={styles["burger-lines"]}></div>
                    <div className={styles["burger-lines"]}></div>
                    <div className={styles["burger-lines"]}></div>
                </button>

                <div
                    className={styles["nav-box"]}
                    style={
                        sidebarOpen ? { display: "block" } : { display: "none" }
                    }
                >
                    <h3>
                        <span
                            className={`${styles["nav-box__icon"]} ${styles["nav-box__icon--user"]}`}
                        ></span>
                        {`${authState?.user?.username}`}
                    </h3>
                    <ul className={styles["nav-box__nav"]}>
                        <li>
                            <Link to="/home">
                                <span
                                    className={`${styles["nav-box__icon"]} ${styles["nav-box__icon--home"]}`}
                                ></span>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/rank">
                                <span
                                    className={`${styles["nav-box__icon"]} ${styles["nav-box__icon--rank"]}`}
                                ></span>
                                Rank
                            </Link>
                        </li>
                        <li>
                            <Link to="/listScore">
                                <span
                                    className={`${styles["nav-box__icon"]} ${styles["nav-box__icon--list"]}`}
                                ></span>
                                List Score
                            </Link>
                        </li>
                        <li>
                            <Link to="/achieve">
                                <span
                                    className={`${styles["nav-box__icon"]} ${styles["nav-box__icon--achieve"]}`}
                                ></span>
                                Achieve
                            </Link>
                        </li>
                    </ul>
                    <div
                        onClick={handleClickSignOut}
                        className={styles["nav-box__logout"]}
                    >
                        Logout
                    </div>
                </div>
            </div>
        </>
    );
};
export default SideNavBar;

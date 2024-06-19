import React from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import SideNavBar from "component/SideNavBar";

const Home = () => {
    return (
        <>
            <SideNavBar />
            <div className={styles["home-box"]}>
                <div className={styles["home-logo"]}>
                    <div className={styles["list-box"]}>
                        <ul className={styles["list-box__ul"]}>
                            <li>
                                <Link to="/game">Start</Link>
                            </li>
                            <li>
                                <Link to="/rank">Rank</Link>
                            </li>
                            <li>
                                <Link to="/listScore">List Score</Link>
                            </li>
                            <li>
                                <Link to="/achieve">Achieve</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;

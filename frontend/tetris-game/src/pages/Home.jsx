import React from "react";
// import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import SideNavBar from "component/SideNavBar";
import HomeLink from "features/Home/HomeLink";

const Home = () => {
    return (
        <div className="h-full bg-[url('/public/img/Tetris-logo.png')] bg-no-repeat bg-center bg-contain max-h-[600px] my-auto relative">
            <ul className="absolute left-1/2 top-1/2 -translate-y-2 -translate-x-[50%] flex flex-col gap-[3%] h-[45%] justify-center w-44">
                <HomeLink to="/game">Start</HomeLink>
                <HomeLink to="/rank">Rank</HomeLink>
                <HomeLink to="/listscore">List Score</HomeLink>
                <HomeLink to="/achieve">Achieve</HomeLink>
            </ul>
        </div>
    );
};

export default Home;

/* <SideNavBar />
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
</div> */

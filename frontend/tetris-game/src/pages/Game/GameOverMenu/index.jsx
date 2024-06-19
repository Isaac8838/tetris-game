// import { useContext, useEffect } from "react";
import styles from "./index.module.scss";

import { Link, useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom";

const GameOverMenu = ({ stats }) => {
    const { score, level, line } = stats;
    const navigate = useNavigate();

    const handleRefresh = () => {
        navigate("/game", { replace: true });
        navigate(0);
    };

    return (
        <div className={styles["GameOverMenu"]}>
            <h2>Game Over</h2>
            <div className={styles["state-box"]}>
                <div className={styles["state"]}>
                    <p>SCORE : {score}</p>
                    <p>LEVEl : {level}</p>
                    <p>LINE : {line}</p>
                </div>
                <ul className={styles["btn"]}>
                    <li>
                        <div onClick={handleRefresh}>New Game</div>
                    </li>
                    <li>
                        <Link to="/rank">Rank</Link>
                    </li>
                    <li>
                        <Link to="/listScore">ListScore</Link>
                    </li>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default GameOverMenu;

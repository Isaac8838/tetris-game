import "./index.css";

// import { Link } from "react-router-dom";

const GameOverMenu = ({ stats }) => {
    const { score, level, line } = stats;
    return (
        <div className="GameOverMenuBG">
            <div className="GameOverMenuContainer">
                <h3>GAME OVER</h3>
                <div className="statsContainer">
                    <h4>Score Stats</h4>
                    <ul>
                        <li>Score:{score}</li>
                        <li>Level:{level}</li>
                        <li>Lines:{line}</li>
                    </ul>
                </div>

                {/* 還沒完成 */}
                {/* <Link to="./">aaaa</Link> */}
            </div>
        </div>
    );
};

export default GameOverMenu;

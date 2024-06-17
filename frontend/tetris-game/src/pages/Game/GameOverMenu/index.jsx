import { useContext, useEffect } from "react";
import "./index.css";
import { AuthContext } from "contexts/AuthContext";
import { createScoreAPI } from "WebAPI";
// import { Link } from "react-router-dom";

const GameOverMenu = ({ stats }) => {
    const { score, level, line } = stats;
    // const { authState, checkAndRenewToken } = useContext(AuthContext);

    // useEffect(() => {
    //     const sendScore = async () => {
    //         if (checkAndRenewToken()) {
    //             try {
    //                 const response = await createScoreAPI(
    //                     stats,
    //                     authState.accessToken
    //                 );
    //                 console.log("Score submitted successfully:", response);
    //             } catch (error) {
    //                 console.error("send score error:", error);
    //             }
    //         }
    //     };
    //     sendScore();
    // }, [stats, authState, checkAndRenewToken]);

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

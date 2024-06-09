import SideNavBar from "component/SideNavBar";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { rankAPI } from "WebAPI";

const Rank = () => {
    useEffect(() => {
        const data = rankAPI("scores", "1");
        // console.log(data);
    }, []);

    return (
        <>
            <SideNavBar></SideNavBar>
            <div className={styles["score-board-box"]}>
                <div className={styles["score-board-box__title"]}>
                    <p>Rank</p>
                    <p>owner</p>
                    <p>score</p>
                    <p>level</p>
                    <p>playtime</p>
                </div>
                <ul className={styles["score-board-box__ul"]}>
                    <li className={styles["score-board-box__list"]}>
                        <p>aaa</p>
                        <p>bbb</p>
                        <p>bbb</p>
                        <p>bbb</p>
                        <p>bbb</p>
                    </li>
                    <li className={styles["score-board-box__list"]}>
                        <p>aaa</p>
                    </li>
                </ul>
            </div>
            <div className={styles["page"]}>
                <div className={styles["page__btn"]}>
                    <span
                        className={`${styles["page__btn--icon"]} ${styles["page__btn--icon--left"]}`}
                    ></span>
                </div>
                <div>1</div>
                <div className={styles["page__btn"]}>
                    <span
                        className={`${styles["page__btn--icon"]} ${styles["page__btn--icon--right"]}`}
                    ></span>
                </div>
            </div>
        </>
    );
};

export default Rank;

import SideNavBar from "component/SideNavBar";
import styles from "./index.module.scss";

const ListScore = () => {
    return (
        <>
            <SideNavBar></SideNavBar>
            <div className={styles["score-board-box"]}>
                <div className={styles["score-board-box__title"]}>
                    <p>ID</p>
                    <p>Username</p>
                    <p>Score</p>
                    <p>Level</p>
                    <p>playtime</p>
                </div>
            </div>

            <div className={styles["page"]}>
                <div className={styles["page__btn"]}>
                    <span
                        className={`${styles["page__btn--icon"]} ${styles["page__btn--icon--left"]}`}
                    ></span>
                </div>
                <div className={styles["page__num"]}>1</div>
                <div className={styles["page__btn"]}>
                    <span
                        className={`${styles["page__btn--icon"]} ${styles["page__btn--icon--right"]}`}
                    ></span>
                </div>
            </div>
        </>
    );
};
export default ListScore;

import styles from "./index.module.scss";
const Stats = ({ stats }) => {
    return (
        <div className={styles["stats"]}>
            <div className={styles["statsBox"]}>
                <div className={styles["statsTitle"]}>Score</div>
                <div className={styles["statsContent"]}>{stats.score}</div>
            </div>
            <div className={styles["statsBox"]}>
                <div className={styles["statsTitle"]}>Level</div>
                <div className={styles["statsContent"]}>{stats.level}</div>
            </div>
            <div className={styles["statsBox"]}>
                <div className={styles["statsTitle"]}>Lines</div>
                <div className={styles["statsContent"]}>{stats.line}</div>
            </div>
        </div>
    );
};
export default Stats;

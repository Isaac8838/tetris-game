import styles from "./index.module.scss";

const AchieveItem = ({ achievement }) => {
    return (
        <li
            className={`${styles["achieve-item"]} ${
                !achievement.done ? styles["incomplete"] : ""
            }`}
        >
            <span>
                <achievement.component />
            </span>
            <h3>{achievement.paragraph}</h3>

            {achievement.done && <p>{achievement.createAt}</p>}
        </li>
    );
};

export default AchieveItem;

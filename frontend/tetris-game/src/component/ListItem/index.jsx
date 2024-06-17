import styles from "./index.module.scss";

const ListItem = ({ item, rank }) => {
    return (
        <li className={styles["score-board-box__list"]}>
            <p>{rank}</p>
            <p>{item.owner}</p>
            <p>{item.score}</p>
            <p>{item.level}</p>
            <p>{item.created_at}</p>
        </li>
    );
};

export default ListItem;

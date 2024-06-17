import styles from "./index.module.scss";

const TetrisContainer = ({ children }) => {
    return <div className={styles["tetris-container"]}>{children}</div>;
};

export default TetrisContainer;

import SideNavBar from "component/SideNavBar";
import styles from "./index.module.scss";
import ListItem from "component/ListItem";
import { useContext, useEffect, useState } from "react";
import { listScoreAPI } from "WebAPI";
import { AuthContext } from "contexts/AuthContext";

const ListScore = () => {
    const { authState } = useContext(AuthContext);

    const [page, setPage] = useState(1);

    const [listScore, setListScore] = useState([]);

    useEffect(() => {
        const { username } = authState.user;
        const fetchData = async () => {
            try {
                const data = await listScoreAPI(username, page);
                setListScore(data);
                return data;
            } catch (err) {
                console.error("fetch list score error", err);
            }
        };
        fetchData();
    }, [authState, page]);

    useEffect(() => {
        console.log(listScore);
    });

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
                <ul className={styles["score-board-box__ul"]}>
                    {listScore.map((item) => {
                        return (
                            <ListItem
                                item={item}
                                key={item.id}
                                rank={(page - 1) * 5 + 1}
                            ></ListItem>
                        );
                    })}
                </ul>
            </div>

            {/* <ListItem item={}></ListItem> */}
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

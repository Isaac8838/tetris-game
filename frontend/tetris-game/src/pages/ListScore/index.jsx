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

    const hanldeClickPreviousPage = () => {
        if (page <= 1) return;
        setPage((page) => (page -= 1));
    };

    const hanldeClickNextPage = () => {
        setPage((page) => (page += 1));
    };

    useEffect(() => {
        const { username } = authState.user;
        const fetchData = async () => {
            try {
                const data = await listScoreAPI(username, page);
                const updateData = data.map((item) => {
                    return {
                        ...item,
                        created_at: new Date(
                            item.created_at
                        ).toLocaleDateString(),
                    };
                });
                setListScore(updateData);
                return data;
            } catch (err) {
                console.error("fetch list score error", err);
            }
        };
        fetchData();
    }, [authState, page]);

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
                    {listScore.map((item, idx) => {
                        return (
                            <ListItem
                                item={item}
                                key={item.id}
                                rank={(page - 1) * 5 + 1 + idx}
                            ></ListItem>
                        );
                    })}
                </ul>
            </div>

            <div className={styles["page"]}>
                <div
                    className={styles["page__btn"]}
                    onClick={hanldeClickPreviousPage}
                >
                    <span
                        className={`${styles["page__btn--icon"]} ${styles["page__btn--icon--left"]}`}
                    ></span>
                </div>
                <div className={styles["page__num"]}>{page}</div>
                <div
                    className={styles["page__btn"]}
                    onClick={hanldeClickNextPage}
                >
                    <span
                        className={`${styles["page__btn--icon"]} ${styles["page__btn--icon--right"]}`}
                    ></span>
                </div>
            </div>
        </>
    );
};
export default ListScore;

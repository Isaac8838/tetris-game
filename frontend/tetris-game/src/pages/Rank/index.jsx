import SideNavBar from "component/SideNavBar";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { rankAPI } from "WebAPI";
import ListItem from "../../component/ListItem";

const Rank = () => {
    const [rankList, setRankList] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("scores");

    useEffect(() => {
        const handleAPI = async () => {
            try {
                const data = await rankAPI(sortBy, String(page));
                const updateData = data.map((item) => {
                    return {
                        ...item,
                        created_at: new Date(
                            item.created_at
                        ).toLocaleDateString(),
                    };
                });
                setRankList(updateData);
            } catch (error) {
                console.log(error);
            }
        };
        handleAPI();
    }, [page, sortBy]);

    const hanldeClickPreviousPage = () => {
        if (page <= 1) return;
        setPage((page) => (page -= 1));
    };

    const hanldeClickNextPage = () => {
        setPage((page) => (page += 1));
    };

    const handleClickSortByScores = () => {
        setSortBy("scores");
    };

    const handleClickSortByLevels = () => {
        setSortBy("levels");
    };

    return (
        <div className={styles["score-board-container"]}>
            <SideNavBar></SideNavBar>
            <div className={styles["score-board-box"]}>
                <div className={styles["score-board-box__title"]}>
                    <p>Rank</p>

                    <p>owner</p>
                    <p
                        onClick={handleClickSortByScores}
                        className={styles["cursor"]}
                    >
                        score
                        {sortBy === "scores" ? (
                            <span className={styles["sort"]} />
                        ) : (
                            <span className={styles["unsort"]} />
                        )}
                    </p>
                    <p
                        onClick={handleClickSortByLevels}
                        className={styles["cursor"]}
                    >
                        level
                        {sortBy === "levels" ? (
                            <span className={styles["sort"]} />
                        ) : (
                            <span className={styles["unsort"]} />
                        )}
                    </p>
                    <p>playtime</p>
                </div>
                <ul className={styles["score-board-box__ul"]}>
                    {rankList.map((rankItem, idx) => {
                        return (
                            <ListItem
                                item={rankItem}
                                key={rankItem.id}
                                rank={(page - 1) * 5 + idx + 1}
                            />
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
        </div>
    );
};

export default Rank;

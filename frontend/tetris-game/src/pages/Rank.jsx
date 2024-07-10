import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "ui/Spinner";
import Table from "ui/Table";
import { rankAPI } from "WebAPI";

const Rank = () => {
    const [page, setPage] = useState(1);

    const { data, isPending } = useQuery({
        queryKey: ["rank", page],
        queryFn: () => rankAPI({ sort: "scores", page }),
    });

    if (isPending) return <Spinner width={40} />;

    return (
        <div className="h-full flex flex-col items-center justify-center relative">
            <Table cols="0.9fr 1.4fr 1fr 0.9fr 0.8fr">
                <Table.Header
                    titles={["Rank", "Username", "Score", "Level", "Line"]}
                />
                {isPending ? (
                    <Spinner width={40} />
                ) : (
                    data?.map((item, index) => (
                        <Table.RankBody
                            key={item.id}
                            data={item}
                            rank={index + 1 + (page - 1) * 5}
                        />
                    ))
                )}
            </Table>
            <Table.Footer page={page} setPage={setPage} />
        </div>
    );
};
export default Rank;

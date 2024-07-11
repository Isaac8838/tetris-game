import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "ui/Spinner";
import Table from "ui/Table";
import { rankAPI } from "WebAPI";

const Rank = () => {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("scores");

    const { data, isPending } = useQuery({
        queryKey: ["rank", sortBy, page],
        queryFn: () => rankAPI({ sort: sortBy, page }),
    });

    if (isPending) return <Spinner width={40} />;

    return (
        <div className="w-[70%] max-w-[900px] h-full flex flex-col justify-center items-center m-auto">
            <div className="self-end mb-4 flex gap-4 items-center text-xl">
                <p className=" text-white">Rank By</p>
                <select
                    className="px-4 py-1 rounded"
                    onChange={(e) => setSortBy(e.target.value)}
                    value={sortBy}
                >
                    <option value="scores">Score</option>
                    <option value="levels">Level</option>
                </select>
            </div>
            <Table cols="0.9fr 1.4fr 1fr 0.9fr 0.8fr">
                <Table.Container>
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
                </Table.Container>
                <Table.Footer page={page} setPage={setPage} />
            </Table>
        </div>
    );
};
export default Rank;

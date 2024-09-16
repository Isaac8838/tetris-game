import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import Spinner from "@/ui/Spinner";
import Table from "@/ui/Table";
import { rankAPI } from "@/utils/WebAPI";

const Rank = () => {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("scores");

    const { data, isPending } = useQuery({
        queryKey: ["rank", sortBy, page],
        queryFn: () => rankAPI({ sort: sortBy, page }),
    });

    return (
        <div className="m-auto flex h-full w-[70%] max-w-[900px] flex-col items-center justify-center">
            <div className="mb-4 flex items-center gap-4 self-end text-xl">
                <p className="text-white">Rank By</p>
                <select
                    className="rounded px-4 py-1"
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
                    <div className="flex flex-col gap-1 overflow-hidden rounded-2xl">
                        {isPending ? (
                            <div className="mx-auto">
                                <Spinner width={40} />
                            </div>
                        ) : data?.length === 0 ? (
                            <div className="bg-custom-purple_content py-4 text-center text-xl text-white">
                                No data
                            </div>
                        ) : (
                            data?.map((item, index) => (
                                <Table.RankBody
                                    key={item.id}
                                    data={item}
                                    rank={index + 1 + (page - 1) * 5}
                                />
                            ))
                        )}
                    </div>
                </Table.Container>
                <Table.Footer
                    page={page}
                    setPage={setPage}
                    data_length={data?.length}
                />
            </Table>
        </div>
    );
};
export default Rank;

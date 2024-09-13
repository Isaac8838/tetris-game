import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "@/ui/Spinner";
import Table from "@/ui/Table";
import { listScoreAPI } from "@/utils/WebAPI";

const ListScore = () => {
    const [page, setPage] = useState(1);

    const username = useSelector((state) => state.user.username);
    const [searchUsername, setSearchUsername] = useState(username);
    const [inputUsername, setInputUsername] = useState(username);

    const { data, isPending } = useQuery({
        queryKey: ["ListScore", searchUsername, page],
        queryFn: () => listScoreAPI({ username: searchUsername, page: page }),
    });

    const handleBlur = () => {
        if (inputUsername === "") {
            setSearchUsername(username);
            setPage(1);
            return;
        }
        setSearchUsername(inputUsername);
        setPage(1);
    };

    return (
        <div className="m-auto flex h-full w-[70%] max-w-[900px] flex-col items-center justify-center">
            <div className="mb-4 flex gap-4 self-end">
                <label htmlFor="search" className="text-xl text-white">
                    Search Player
                </label>
                <input
                    id="search"
                    type="text"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    onBlur={handleBlur}
                    className="rounded px-2 text-lg outline-none"
                />
            </div>

            <Table cols="0.5fr 1.4fr 0.9fr 0.9fr 1.1fr">
                <Table.Container>
                    <Table.Header
                        titles={[
                            "ID",
                            "Username",
                            "Score",
                            "Level",
                            "record time",
                        ]}
                    />
                    <div className="flex flex-col gap-1 overflow-hidden rounded-2xl">
                        {isPending ? (
                            <div className="mx-auto">
                                <Spinner width={40} />
                            </div>
                        ) : data?.length === 0 ? (
                            <div className="bg-custom-purple_content py-4 text-center text-xl text-white">
                                This Player Has No Data
                            </div>
                        ) : (
                            data?.map((item) => (
                                <Table.ListScoreBody
                                    key={item.id}
                                    data={item}
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

export default ListScore;

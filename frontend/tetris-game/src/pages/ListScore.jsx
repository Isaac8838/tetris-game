import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "ui/Spinner";
import Table from "ui/Table";
import { listScoreAPI } from "utils/WebAPI";

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
        <div className="w-[70%] h-full flex flex-col justify-center items-center m-auto">
            <div className="self-end mb-4 flex gap-4">
                <label htmlFor="search" className="text-xl text-white">
                    Search Player
                </label>
                <input
                    id="search"
                    type="text"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    onBlur={handleBlur}
                    className="outline-none px-2 text-lg rounded"
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
                    {isPending ? (
                        <div className="mx-auto">
                            <Spinner width={40} />
                        </div>
                    ) : (
                        data?.map((item, index) => (
                            <Table.ListScoreBody key={item.id} data={item} />
                        ))
                    )}
                </Table.Container>
                <Table.Footer
                    page={page}
                    setPage={setPage}
                    data_length={data?.length}
                />
                {/* <Table.JumpTable /> */}
            </Table>
        </div>
    );
};

export default ListScore;

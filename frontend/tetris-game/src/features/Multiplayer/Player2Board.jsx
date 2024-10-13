import { buildBoard } from "@/utils/Board";
import BoardCell from "../Tetris/BoardCell";
import { useMultiplayerDataContext } from "./useMultiplayerDataContext";
import { useEffect, useState } from "react";

//initial state
const board = buildBoard(10, 20);

const Player2Board = () => {
    const { receiveData } = useMultiplayerDataContext();

    const [player2Name, setPlayer2Name] = useState("");

    const boardStyle = {
        gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`,
    };

    useEffect(() => {
        if (receiveData?.player && receiveData?.player !== player2Name) {
            setPlayer2Name(receiveData?.player);
        }
    }, [receiveData?.player, player2Name]);

    return (
        <>
            <div className="relative m-auto box-content aspect-[1/2] h-[650px]">
                <div
                    className="grid h-full gap-[2px] overflow-hidden rounded-2xl border-4 border-custom-purple_border bg-custom-purple_content"
                    style={boardStyle}
                >
                    {board.rows.map((columns, y) =>
                        columns.map((cell, x) => (
                            <BoardCell
                                key={`${y}-${x}`}
                                cell={cell}
                            ></BoardCell>
                        )),
                    )}
                </div>
                <div className="flex justify-center text-2xl text-gray-800">
                    {player2Name === "" ? "no player" : player2Name}
                </div>
            </div>
        </>
    );
};

export default Player2Board;

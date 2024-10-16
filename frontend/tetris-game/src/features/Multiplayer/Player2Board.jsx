import { buildBoard } from "@/utils/Board";
import BoardCell from "../Tetris/BoardCell";
import { useOpponentDataContext } from "./OpponentDataContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Player2Board = () => {
    const { gameState } = useSelector((state) => state.tetris);

    const [player2Board, setPlayer2Board] = useState(buildBoard(10, 20));
    const [player2Name, setPlayer2Name] = useState("");

    const { opponentData } = useOpponentDataContext();

    const boardStyle = {
        gridTemplateRows: `repeat(${player2Board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${player2Board.size.columns}, 1fr)`,
    };

    useEffect(() => {
        if (opponentData?.player && opponentData?.player !== player2Name) {
            setPlayer2Name(opponentData?.player);
        }
    }, [opponentData?.player, player2Name]);

    //更新p2 board
    useEffect(() => {
        if (opponentData.data?.board.length > 0) {
            setPlayer2Board((prev) => {
                return {
                    ...prev,
                    rows: opponentData.data.board,
                };
            });
        }
    }, [opponentData?.data]);

    return (
        <>
            <div className="relative m-auto box-content aspect-[1/2] h-[650px]">
                <div
                    className="grid h-full gap-[2px] overflow-hidden rounded-2xl border-4 border-custom-purple_border bg-custom-purple_content"
                    style={boardStyle}
                >
                    {gameState >= 1 &&
                        player2Board.rows.map((columns, y) =>
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

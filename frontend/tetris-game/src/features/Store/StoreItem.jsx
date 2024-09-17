import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildBoard, transferToBoard } from "@/utils/Board";
import { TETROMINOES } from "@/utils/Tetromino";
import BoardCell from "../Tetris/BoardCell";
import ApplyButton from "./ApplyButton";
import { useDispatch, useSelector } from "react-redux";
import { changeSkin } from "../User/userSlice";

const StoreItem = ({ skin }) => {
    const emptyBoard = buildBoard(4, 4);
    const board = transferToBoard({
        rows: emptyBoard.rows,
        tetromino: TETROMINOES["Z"],
        collide: false,
        position: { row: 1, column: 0 },
    });

    const dispatch = useDispatch();

    const handlePreview = () => {
        dispatch(changeSkin(skin.name));
    };

    const useSkin = useSelector((state) => state.user.skin);

    return (
        <Card
            key={`${skin.name}`}
            className="cursor-pointer rounded-3xl border-0 bg-custom-purple_content py-2 transition-colors hover:bg-[#151055]"
            onClick={handlePreview}
        >
            <CardContent className="flex flex-col items-center gap-2 pb-1">
                <h3 className="text-xl capitalize text-custom-white_text">
                    {skin.name}
                </h3>
                <div className="grid aspect-square h-24 grid-cols-4 grid-rows-4 gap-[2px] rounded-xl bg-[#1F1884] p-1 shadow-xl">
                    {board.map((row, y) =>
                        row.map((cell, x) => (
                            <BoardCell
                                key={`${skin.name}-${y}-${x}`}
                                cell={
                                    cell.className !== ""
                                        ? { className: skin.name }
                                        : cell
                                }
                            />
                        )),
                    )}
                </div>
                <p className="text-xl text-custom-white_text">
                    {skin.isBuy ? "You have this" : "$100"}
                </p>
                {skin.isBuy ? (
                    <ApplyButton
                        skinName={skin.name}
                        isUsed={skin.name === useSkin}
                    />
                ) : (
                    <Button className="bg-custom-green_bg w-full rounded-full text-lg">
                        <p className="text-shadow-sm">Buy now</p>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default StoreItem;

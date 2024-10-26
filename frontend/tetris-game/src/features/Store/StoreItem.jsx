import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildBoard, transferToBoard } from "@/utils/Board";
import { TETROMINOES } from "@/utils/Tetromino";
import BoardCell from "../Tetris/BoardCell";
import ApplyButton from "./ApplyButton";
import { DialogTrigger } from "@/components/ui/dialog";
import { useSkinContext } from "@/ui/AppLayout";

const StoreItem = ({
    skin,
    // setSkinPreview,
    handleSelectSkin,
    refetchSkinList,
}) => {
    const { setSkinPreviewId } = useSkinContext();

    const emptyBoard = buildBoard(4, 4);

    const board = transferToBoard({
        rows: emptyBoard.rows,
        tetromino: TETROMINOES["Z"],
        collide: false,
        position: { row: 1, column: 0 },
    });

    const handlePreview = () => {
        // console.log(skin);
        setSkinPreviewId(skin.skinId);
    };

    return (
        <>
            <Card
                key={`${skin.skinName}`}
                className="cursor-pointer rounded-3xl border-0 bg-custom-purple_content py-2 transition-colors hover:bg-[#151055]"
                onClick={handlePreview}
            >
                <CardContent className="flex flex-col items-center gap-2 pb-1">
                    <h3 className="text-xl capitalize text-custom-white_text">
                        {skin.skinName}
                    </h3>
                    <div className="grid aspect-square h-24 grid-cols-4 grid-rows-4 gap-[2px] rounded-xl bg-[#1F1884] p-1 shadow-xl">
                        {board.map((row, y) =>
                            row.map((cell, x) => (
                                <BoardCell
                                    key={`${skin.skinName}-${y}-${x}`}
                                    cell={
                                        cell.className !== ""
                                            ? { className: skin.skinName }
                                            : cell
                                    }
                                />
                            )),
                        )}
                    </div>
                    <p className="text-xl text-custom-white_text">
                        {skin.isBuy ? "You have this" : `$${skin.skinPrice}`}
                    </p>
                    {skin.isBuy ? (
                        <ApplyButton
                            skin_id={skin.skinId}
                            isUsed={skin.isDefault}
                            refetchSkinList={refetchSkinList}
                        />
                    ) : (
                        <DialogTrigger asChild>
                            <Button
                                className="w-full rounded-full bg-custom-green_bg text-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectSkin();
                                }}
                            >
                                <p className="text-shadow-sm">Buy now</p>
                            </Button>
                        </DialogTrigger>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default StoreItem;

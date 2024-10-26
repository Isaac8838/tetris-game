import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import StoreItem from "./StoreItem";
import "@/styles/storePreview.css";
import Spinner from "@/ui/Spinner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Close } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { updateTokenThunk } from "../User/userSlice";
import { purchaseSkinAPI } from "@/utils/WebAPI";

const TetrominoStoreComponent = ({
    skinList,
    isLoading,
    userBalance,
    refetchUserBalance,
    refetchSkinList,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [balanceInsufficient, setBalanceInsufficient] = useState(false);
    const [selectedSkin, setSelectedSkin] = useState(null);

    const { access_token } = useSelector((state) => state.user);

    const access_tokenRef = useRef(access_token);

    const dispatch = useDispatch();

    const tetrisSkins =
        skinList &&
        skinList.reduce((acc, cur, index) => {
            if (index % 2 === 0) acc.push([cur]);
            else acc[acc.length - 1].push(cur);
            return acc;
        }, []);

    useEffect(() => {
        access_tokenRef.current = access_token;
    }, [access_token]);

    const handleBuySkin = async () => {
        setBalanceInsufficient(false);

        const { data: userBalance } = await refetchUserBalance();

        if (userBalance.balance < selectedSkin.skinPrice) {
            setBalanceInsufficient(true);
            return;
        }

        //更新token
        await dispatch(updateTokenThunk());

        await purchaseSkinAPI({
            access_token: access_tokenRef.current,
            amount: selectedSkin.skinPrice,
            skin_id: selectedSkin.skinId,
        });

        await refetchSkinList();
        await refetchUserBalance();

        setDialogOpen(false);
        setSelectedSkin(null);
    };

    return (
        <div className="relative min-w-[625px] max-w-[39rem] rounded-3xl bg-[#000346] p-8">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl font-bold tracking-wide text-custom-white_text">
                COIN:${userBalance?.balance || 0}
            </div>
            {isLoading ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Spinner width={30} />
                </div>
            ) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <Carousel slidesToScroll={3} className="h-full">
                        <CarouselContent className="relative h-full">
                            {tetrisSkins.map((skins, i) => {
                                //skins是長度為2的一維陣列
                                return (
                                    <CarouselItem
                                        key={`skinstore-${i}`}
                                        className="flex basis-1/3 flex-col gap-8"
                                    >
                                        {skins.map((skin) => {
                                            return (
                                                <StoreItem
                                                    key={`${skin.skinName}`}
                                                    skin={skin}
                                                    handleSelectSkin={() => {
                                                        setSelectedSkin(skin);
                                                    }}
                                                    refetchSkinList={
                                                        refetchSkinList
                                                    }
                                                />
                                            );
                                        })}
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    {selectedSkin && (
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Purchase</DialogTitle>
                                <VisuallyHidden asChild>
                                    <DialogDescription>
                                        Are you sure you want to purchase this
                                        skin?
                                    </DialogDescription>
                                </VisuallyHidden>
                            </DialogHeader>
                            <div>
                                Do you want to purchase this skinv for{" "}
                                {selectedSkin.skinPrice} coin
                            </div>
                            {balanceInsufficient && (
                                <div className="text-red-500">
                                    Your account balance is insufficient
                                </div>
                            )}
                            <DialogFooter>
                                <Close asChild>
                                    <Button variant="ghost" className="border">
                                        Cancel
                                    </Button>
                                </Close>
                                <Button
                                    variant="secondary"
                                    onClick={handleBuySkin}
                                >
                                    Buy
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            )}
        </div>
    );
};

export default TetrominoStoreComponent;

import SkinPreviews from "@/features/Store/SkinPreviews";
import TetrominoStoreComponent from "@/features/Store/TetrominoStoreComponent";
import { useSkinContext } from "@/ui/AppLayout";
import {
    getSkinAndPriceAPI,
    getUserBalanceAPI,
    getUserSkinAPI,
} from "@/utils/WebAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const tetrisSkinsName = {
    0: {
        name: "default",
    },
    1: {
        name: "envelope",
    },
    2: {
        name: "round",
    },
};

const TetrominoStore = () => {
    const dispatch = useDispatch();

    const { access_token } = useSelector((state) => state.user);

    const { setSkinPreviewId } = useSkinContext();

    const {
        data: skinList,
        isLoading,
        refetch: refetchSkinList,
    } = useQuery({
        queryKey: ["skinList"],
        queryFn: () => getSkinData({ dispatch, access_token }),
    });

    const { data: userBalance, refetch: refetchUserBalance } = useQuery({
        queryKey: ["userBalance"],
        queryFn: () => getUserBalanceAPI({ access_token }),
    });

    useEffect(() => {
        return () => {
            console.log("離開頁面");
            setSkinPreviewId(null);
        };
    }, [setSkinPreviewId]);

    return (
        <div className="flex justify-center gap-32 px-32">
            <SkinPreviews />
            <TetrominoStoreComponent
                skinList={skinList}
                isLoading={isLoading}
                // setSkinPreview={setSkinPreview}
                userBalance={userBalance}
                refetchUserBalance={refetchUserBalance}
                refetchSkinList={refetchSkinList}
            />
        </div>
    );
};

const getSkinData = async ({ dispatch, access_token }) => {
    const [allSkins, userSkins] = await Promise.all([
        getSkinAndPriceAPI(),
        getUserSkinAPI({ dispatch, access_token }),
    ]);
    const storeSkins = allSkins.map((skin) => {
        const skinId = skin.skin_id;
        const skinName = transferSkinIdToName(skinId);

        const userSkin = userSkins.find(
            (userSkin) => userSkin.skin_id === skinId,
        );

        const isBuy = !!userSkin; // 將找到的結果轉換為布林值
        const isDefault = userSkin ? userSkin.default_skin : false; // 若存在 userSkin，則提取 default_skin

        return { skinId, skinName, skinPrice: skin.price, isBuy, isDefault };
    });

    return storeSkins;
};

const transferSkinIdToName = (skinId) => {
    if (!tetrisSkinsName[skinId]) return "unknownSkinID";
    return tetrisSkinsName[skinId].name;
};

export default TetrominoStore;

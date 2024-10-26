import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDefaultSkinAPI } from "@/utils/WebAPI";
import { changeSkin } from "@/features/User/userSlice";
import { createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";

export const SkinContext = createContext(null);

export const useSkinContext = () => useContext(SkinContext);

const AppLayout = () => {
    const [skinPreviewId, setSkinPreviewId] = useState(null);

    const { access_token, skinId } = useSelector((state) => state.user);

    const access_tokenRef = useRef(access_token);

    const dispatch = useDispatch();

    useEffect(() => {
        access_tokenRef.current = access_token;
    }, [access_token]);

    //初始化skin(呼叫API)
    useEffect(() => {
        const initialSkinId = async () => {
            const { skin_id } = await getDefaultSkinAPI({
                access_token: access_tokenRef.current,
            });

            await dispatch(changeSkin(skin_id));
        };

        initialSkinId();
    }, [dispatch]);

    useEffect(() => {
        const ApplySkinCss = async () => {
            const linkId = "dynamic-skin";
            // 移除舊的 skin 樣式
            const existingLink = document.getElementById(linkId);
            if (existingLink) {
                existingLink.remove();
            }

            // 動態創建新的 <link> 並加載新的 skin
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.id = linkId;

            const skinToApply = skinPreviewId !== null ? skinPreviewId : skinId;

            if (skinToApply === 0) {
                link.href = "/css/skin/default.css";
            } else if (skinToApply === 1) {
                link.href = "/css/skin/envelope.css";
            } else if (skinToApply === 2) {
                link.href = "/css/skin/round.css";
            }

            // 將新的 <link> 插入 head
            document.head.appendChild(link);

            return () => {
                if (link) link.remove();
            };
        };

        ApplySkinCss();
    }, [skinId, skinPreviewId]);

    return (
        <SkinContext.Provider value={{ setSkinPreviewId }}>
            <div className="relative flex h-auto w-full justify-center">
                <Toaster />
                <Sidebar />
                <div className="h-full w-full min-w-[1000px] pt-24">
                    <Outlet />
                </div>
            </div>
        </SkinContext.Provider>
    );
};

export default AppLayout;

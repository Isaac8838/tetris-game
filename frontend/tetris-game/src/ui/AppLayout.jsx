import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const AppLayout = () => {
    const skin = useSelector((state) => state.user.skin);

    useEffect(() => {
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

        if (skin === "default") {
            // link.href = "/src/styles/skin/default.css";
            link.href = "/css/skin/default.css";
        } else if (skin === "envelope") {
            // link.href = "/src/styles/skin/envelope.css";
            link.href = "/css/skin/envelope.css";
        } else if (skin === "round") {
            // link.href = "/src/styles/skin/round.css";
            link.href = "/css/skin/round.css";
        }

        // 將新的 <link> 插入 head
        document.head.appendChild(link);

        return () => {
            if (link) link.remove();
        };
    }, [skin]);

    return (
        <div className="relative flex h-auto w-full justify-center">
            <Sidebar />
            <div className="h-full w-full min-w-[1000px] pt-24">
                <Outlet />
            </div>
        </div>
    );
};

export default AppLayout;

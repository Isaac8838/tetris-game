import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
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

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
    return (
        <div className="w-full flex h-auto justify-center relative">
            <Sidebar />
            <div className="w-[30rem] md:w-[70%] pt-24 h-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AppLayout;

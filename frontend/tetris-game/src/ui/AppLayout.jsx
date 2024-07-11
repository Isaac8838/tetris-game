import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
    return (
        <div className="h-full w-full flex flex-col relative">
            <Sidebar />
            <Outlet />
        </div>
    );
};

export default AppLayout;

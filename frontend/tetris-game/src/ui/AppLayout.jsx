import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="h-full w-full flex flex-col relative">
            <Outlet />
        </div>
    );
};

export default AppLayout;

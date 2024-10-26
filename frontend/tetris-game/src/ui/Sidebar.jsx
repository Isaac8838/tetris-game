import { useState } from "react";
import {
    HiOutlineChartBar,
    HiOutlineMenu,
    HiOutlineNewspaper,
    HiOutlineUserCircle,
} from "react-icons/hi";
import { PiMedalThin } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { clearUser } from "@/features/User/userSlice";
import { FaStore } from "react-icons/fa";
const Sidebar = () => {
    const [open, setOpen] = useState(false);

    const username = useSelector((state) => state.user.username);
    const dispatch = useDispatch();
    return (
        <>
            <HiOutlineMenu
                className="fixed top-6 z-20 mr-6 box-content block cursor-pointer rounded-full bg-black p-2 text-3xl text-white transition-all"
                style={{ right: open ? "300px" : "0" }}
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
            />

            {/* sidebar background */}
            <div
                className="fixed left-0 top-0 h-full bg-black/40 transition-all"
                style={{
                    width: open ? "calc(100% - 300px)" : "100%",
                    opacity: open ? 1 : 0,
                    zIndex: open ? 10 : -1,
                }}
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
            ></div>

            {/* sidebar */}
            <div
                className="divide fixed right-0 top-0 z-10 flex h-full flex-col gap-5 bg-black/80 transition-all"
                style={{
                    width: open ? "300px" : "0",
                    borderLeft: open ? "2px solid #817474" : "none",
                    paddingLeft: open ? "20px" : "0",
                    paddingRight: open ? "20px" : "0",
                }}
            >
                <div className="flex items-center gap-4 border-b-2 py-4">
                    <span>
                        <HiOutlineUserCircle className="text-5xl text-white" />
                    </span>
                    <p className="text-3xl text-white">{username}</p>
                </div>
                <div className="border-b-2 pb-4">
                    <ul className="flex flex-col items-start gap-5">
                        {/* <li className="inline-flex gap-4 text-stone-400 hover:text-stone-100"> */}
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/home"
                                className="flex items-center gap-4 text-stone-400 hover:text-stone-100"
                            >
                                <GoHome className="text-3xl" />
                                <p className="text-2xl">Home</p>
                            </Link>
                        </li>
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/rank"
                                className="flex items-center gap-4 text-stone-400 hover:text-stone-100"
                            >
                                <HiOutlineChartBar className="text-3xl" />
                                <p className="text-2xl">Rank</p>
                            </Link>
                        </li>
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/listScore"
                                className="flex items-center gap-4 text-stone-400 hover:text-stone-100"
                            >
                                <HiOutlineNewspaper className="text-3xl" />
                                <p className="text-2xl">List Score</p>
                            </Link>
                        </li>
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/achievement"
                                className="flex items-center gap-4 text-stone-400 hover:text-stone-100"
                            >
                                <PiMedalThin className="text-3xl" />
                                <p className="text-2xl">Achievement</p>
                            </Link>
                        </li>
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/store"
                                className="flex items-center gap-4 text-stone-400 hover:text-stone-100"
                            >
                                <FaStore className="text-3xl" />
                                <p className="text-2xl">Store</p>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div
                    className="cursor-pointer text-2xl text-stone-500 hover:text-stone-100"
                    onClick={() => dispatch(clearUser())}
                >
                    Sign out
                </div>
            </div>
        </>
    );
};
export default Sidebar;

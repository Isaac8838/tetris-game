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
import { clearUser } from "features/User/userSlice";
const Sidebar = () => {
    const [open, setOpen] = useState(false);

    const username = useSelector((state) => state.user.username);
    const dispatch = useDispatch();
    return (
        <>
            <HiOutlineMenu
                className="text-white text-3xl block p-2 box-content bg-black rounded-full cursor-pointer fixed z-20 transition-all mr-6 top-6"
                style={{ right: open ? "300px" : "0" }}
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
            />

            {/* sidebar background */}
            <div
                className=" absolute h-full bg-black/40 transition-all"
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
                className="h-full bg-black/80 transition-all fixed z-10 right-0 divide flex gap-5 flex-col"
                style={{
                    width: open ? "300px" : "0",
                    borderLeft: open ? "2px solid #817474" : "none",
                    paddingLeft: open ? "20px" : "0",
                    paddingRight: open ? "20px" : "0",
                }}
            >
                <div className="flex items-center gap-4 py-4 border-b-2">
                    <span>
                        <HiOutlineUserCircle className="text-white text-5xl" />
                    </span>
                    <p className="text-white text-3xl">{username}</p>
                </div>
                <div className=" pb-4 border-b-2">
                    <ul className=" flex flex-col gap-5 items-start">
                        {/* <li className="inline-flex gap-4 text-stone-400 hover:text-stone-100"> */}
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/home"
                                className=" flex gap-4 text-stone-400 hover:text-stone-100 items-center"
                            >
                                <GoHome className=" text-3xl" />
                                <p className="text-2xl">Home</p>
                            </Link>
                        </li>
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/rank"
                                className=" flex gap-4 text-stone-400 hover:text-stone-100 items-center"
                            >
                                <HiOutlineChartBar className=" text-3xl" />
                                <p className="text-2xl">Rank</p>
                            </Link>
                        </li>
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/listScore"
                                className=" flex gap-4 text-stone-400 hover:text-stone-100 items-center"
                            >
                                <HiOutlineNewspaper className=" text-3xl" />
                                <p className="text-2xl">List Score</p>
                            </Link>
                        </li>
                        <li onClick={() => setOpen(false)}>
                            <Link
                                to="/achievement"
                                className=" flex gap-4 text-stone-400 hover:text-stone-100 items-center"
                            >
                                <PiMedalThin className=" text-3xl" />
                                <p className="text-2xl">Achievement</p>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div
                    className=" text-stone-500 cursor-pointer text-2xl hover:text-stone-100"
                    onClick={() => dispatch(clearUser())}
                >
                    Sign out
                </div>
            </div>
        </>
    );
};
export default Sidebar;

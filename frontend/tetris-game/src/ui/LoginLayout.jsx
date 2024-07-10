import { NavLink } from "react-router-dom";

const nvaLinkClass =
    "font-medium  text-stone-300/60 hover:bg-sky-400 hover:text-white rounded-md px-2";

const nvaLinkClassActive = "font-medium text-white px-2";

const LoginLayout = ({ children }) => {
    return (
        <div className="flex justify-center items-center h-full ">
            <div className="flex justify-center gap-10 w-[70%]">
                <div className="flex flex-[1_0_300px] md:flex-[1_0_400px] flex-col max-w-[450px] gap-10">
                    <div className="flex justify-center text-white text-6xl">
                        Welcome
                    </div>
                    <div className="flex gap-6 text-3xl self-start">
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? nvaLinkClassActive : nvaLinkClass
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/signup"
                            className={({ isActive }) =>
                                isActive ? nvaLinkClassActive : nvaLinkClass
                            }
                        >
                            Register
                        </NavLink>
                    </div>
                    {children}
                </div>
                <div className="hidden lg:flex items-center">
                    <img
                        src="img/login_img.jpg"
                        alt="tetris"
                        className="max-h-[430px] rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginLayout;

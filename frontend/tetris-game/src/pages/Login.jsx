import React from "react";
import { useForm } from "react-hook-form";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";
// import styles from "./index.module.scss";
// import "scss/component.scss";
import LoginLayout from "ui/LoginLayout";
import Input from "ui/Input";
import SubmitBTN from "ui/SubmitBTN";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "WebAPI";
import { useDispatch } from "react-redux";
import { setUser } from "features/User/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        mutate: loginMutate,
        isError: loginIsError,
        isPending: loginIsPending,
    } = useMutation({
        mutationKey: ["login"],
        mutationFn: loginAPI,
        onSuccess: (data) => {
            //更新redux中user狀態
            dispatch(
                setUser({
                    username: data.user.username,
                    access_token: data.access_token,
                    access_token_expires_at: data.access_token_expires_at,
                    refresh_token: data.refresh_token,
                    refresh_token_expires_at: data.refresh_token_expires_at,
                }),
            );
            navigate("/home");
        },
        onError: (error) => {
            console.log("失敗", error);
        },
    });

    const onSubmit = (data) => {
        loginMutate(data);
    };

    return (
        <LoginLayout>
            <form
                className="flex gap-7 flex-col w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <Input
                        Icon={HiOutlineUser}
                        register={register}
                        Iid="username"
                        validateRule={{
                            required: "username can't be empty",
                        }}
                    />
                    <p className=" text-orange-400 font-semibold flex justify-end">
                        {errors.username?.message}
                    </p>
                </div>

                <div>
                    <Input
                        Icon={HiOutlineLockClosed}
                        register={register}
                        Iid="password"
                        type="password"
                        validateRule={{
                            required: "password can't be empty",
                            minLength: {
                                value: 6,
                                message:
                                    "password must be at least 6 characters",
                            },
                        }}
                    />
                    <p className=" text-orange-400 font-semibold flex justify-end">
                        {errors.password?.message}
                    </p>
                </div>

                <SubmitBTN>
                    {/* {loginIsPending ? <span className="spinner" /> : "Login"} */}
                    Login
                    {loginIsPending && <span className="spinner" />}
                </SubmitBTN>

                {loginIsError && (
                    <p className="text-red-700 mt-[-30px] font-bold">
                        username or password incorrect
                    </p>
                )}
            </form>
        </LoginLayout>
    );
};

export default Login;

// <div className={styles["login-box"]}>
//     <div className={styles["left-box"]}>
//         <h2 className={styles["left-box__title"]}>Welcome</h2>
//         <ul className={styles["left-box__list"]}>
//             <li>
//                 <NavLink
//                     to="/login/loginComponent"
//                     className={({ isActive }) =>
//                         isActive
//                             ? styles["left-box__navlink-active"]
//                             : styles["left-box__navlink"]
//                     }
//                 >
//                     Login
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink
//                     to="/login/signupComponent"
//                     className={({ isActive }) =>
//                         isActive
//                             ? styles["left-box__navlink-active"]
//                             : styles["left-box__navlink"]
//                     }
//                 >
//                     Register
//                 </NavLink>
//             </li>
//         </ul>
//         <Outlet></Outlet>
//     </div>
//     <div className={styles["right-box"]}></div>
// </div>

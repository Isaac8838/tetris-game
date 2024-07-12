import React from "react";
import { useForm } from "react-hook-form";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";
// import styles from "./index.module.scss";
// import "scss/component.scss";
import LoginLayout from "ui/LoginLayout";
import Input from "ui/Input";
import SubmitBTN from "ui/SubmitBTN";
import useLogin from "features/Login/useLogin";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { handleLogin, loginIsError, loginIsPending } = useLogin();

    return (
        <LoginLayout>
            <form
                className="flex gap-7 flex-col w-full"
                onSubmit={handleSubmit(handleLogin)}
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

                <SubmitBTN isPending={loginIsPending}>Login</SubmitBTN>

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

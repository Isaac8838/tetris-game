import { useMutation } from "@tanstack/react-query";
import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineLockOpen,
    HiOutlineMail,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Input from "ui/Input";
import LoginLayout from "ui/LoginLayout";
import SubmitBTN from "ui/SubmitBTN";
import { createUserAPI } from "WebAPI";

const Signup = () => {
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [fetchError, setFetchError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const signupMutate = useMutation({
        mutationKey: ["signup"],
        mutationFn: createUserAPI,
        onSuccess: (data) => {
            navigate("/login");
        },
        onError: (error) => {
            // 處理錯誤響應
            if (error.message !== "fetch failed") {
                const errorStr = JSON.parse(error.message).error;
                const errorMessage = errorStr.match(/"([^"]*)"/)[0];
                if (errorMessage === '"users_pkey"') {
                    setFetchError("Username already exists");
                } else if (errorMessage === '"users_email_key"') {
                    setFetchError("Email already exists");
                }
            } else {
                setFetchError("fetch error");
            }
        },
    });

    const onSubmit = (data) => {
        setRepeatPasswordError("");
        setFetchError("");

        if (data.password !== data["repeat-password"]) {
            setRepeatPasswordError("Password does not match");
            return;
        }

        const { username, password, email } = data;
        signupMutate.mutate({ username, password, email });
    };

    return (
        <LoginLayout>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-7 flex-col w-full"
            >
                <div>
                    <Input
                        Icon={HiOutlineUser}
                        register={register}
                        Iid="username"
                        validateRule={{
                            required: "Username is required",
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
                            required: "Password is required",
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

                <div>
                    <Input
                        Icon={HiOutlineLockOpen}
                        register={register}
                        Iid="repeat-password"
                        type="password"
                        validateRule={{
                            required: "Repeat Password is required",
                        }}
                    />
                    <p className=" text-orange-400 font-semibold flex justify-end">
                        {errors["repeat-password"]?.message ||
                            repeatPasswordError}
                    </p>
                </div>

                <div>
                    <Input
                        Icon={HiOutlineMail}
                        register={register}
                        Iid="email"
                        type="email"
                        validateRule={{
                            required: "Email is required",
                        }}
                    />
                    <p className=" text-orange-400 font-semibold flex justify-end">
                        {errors.email?.message}
                    </p>
                </div>

                <SubmitBTN>Register</SubmitBTN>
                {fetchError && (
                    <p className=" text-red-700 mt-[-30px] font-bold">
                        {fetchError}
                    </p>
                )}
            </form>
        </LoginLayout>
    );
};

export default Signup;

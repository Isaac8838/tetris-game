import Input from "@/ui/Input";
import SubmitBTN from "@/ui/SubmitBTN";
import { createUserAPI } from "@/utils/WebAPI";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    HiOutlineLockClosed,
    HiOutlineLockOpen,
    HiOutlineMail,
    HiOutlineUser,
} from "react-icons/hi";

const RegisterComponent = ({ setTabValue }) => {
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [fetchError, setFetchError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { mutate: signupMutate, isPending } = useMutation({
        mutationKey: ["signup"],
        mutationFn: createUserAPI,
        onSuccess: () => {
            setTabValue("login");
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
        signupMutate({ username, password, email });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-9 flex-col w-full"
        >
            <div className="relative">
                <Input
                    Icon={HiOutlineUser}
                    register={register}
                    Iid="username"
                    validateRule={{
                        required: "Username is required",
                    }}
                />
                <p className=" text-red-500 font-semibold flex justify-end absolute right-0">
                    {errors.username?.message}
                </p>
            </div>

            <div className="relative">
                <Input
                    Icon={HiOutlineLockClosed}
                    register={register}
                    Iid="password"
                    type="password"
                    validateRule={{
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "password must be at least 6 characters",
                        },
                    }}
                />
                <p className=" text-red-500 font-semibold flex justify-end absolute right-0">
                    {errors.password?.message}
                </p>
            </div>

            <div className="relative">
                <Input
                    Icon={HiOutlineLockOpen}
                    register={register}
                    Iid="repeat-password"
                    type="password"
                    validateRule={{
                        required: "Repeat Password is required",
                    }}
                />
                <p className=" text-red-500 font-semibold flex justify-end absolute right-0">
                    {errors["repeat-password"]?.message || repeatPasswordError}
                </p>
            </div>

            <div className="relative">
                <Input
                    Icon={HiOutlineMail}
                    register={register}
                    Iid="email"
                    type="email"
                    validateRule={{
                        required: "Email is required",
                    }}
                />
                <p className=" text-red-500 font-semibold flex justify-end absolute right-0">
                    {errors.email?.message}
                </p>
            </div>

            <SubmitBTN isPending={isPending}>Register</SubmitBTN>
            {fetchError && (
                <p className=" text-red-500 mt-[-30px] font-bold">
                    {fetchError}
                </p>
            )}
        </form>
    );
};

export default RegisterComponent;

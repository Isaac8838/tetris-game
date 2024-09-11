import { useForm } from "react-hook-form";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";

import useLogin from "@/features/Login/useLogin";
import Input from "@/ui/Input";
import SubmitBTN from "@/ui/SubmitBTN";

const LoginComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { handleLogin, loginIsError, loginIsPending } = useLogin();

    return (
        <form
            className="flex gap-9 flex-col w-full"
            onSubmit={handleSubmit(handleLogin)}
        >
            <div className="relative">
                <Input
                    Icon={HiOutlineUser}
                    register={register}
                    Iid="username"
                    validateRule={{
                        required: "username can't be empty",
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
                        required: "password can't be empty",
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

            <SubmitBTN isPending={loginIsPending}>Login</SubmitBTN>

            {loginIsError && (
                <p className="text-red-700 mt-[-30px] font-bold">
                    username or password incorrect
                </p>
            )}
        </form>
    );
};

export default LoginComponent;

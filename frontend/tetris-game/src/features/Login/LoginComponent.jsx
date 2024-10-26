import { useForm } from "react-hook-form";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";

import useLogin from "@/features/Login/useLogin";
import Input from "@/ui/Input";
import SubmitBTN from "@/ui/SubmitBTN";
import { useSelector } from "react-redux";

const LoginComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { handleLogin, loginIsError, loginIsPending } = useLogin();

    const { username } = useSelector((state) => state.user);

    return (
        <form
            className="flex w-full flex-col gap-9"
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
                    defaultValue={username}
                />
                <p className="absolute right-0 flex justify-end font-semibold text-red-500">
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
                <p className="absolute right-0 flex justify-end font-semibold text-red-500">
                    {errors.password?.message}
                </p>
            </div>

            <SubmitBTN isPending={loginIsPending}>Login</SubmitBTN>

            {loginIsError && (
                <p className="mt-[-30px] font-bold text-red-700">
                    username or password incorrect
                </p>
            )}
        </form>
    );
};

export default LoginComponent;

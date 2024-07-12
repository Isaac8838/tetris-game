import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "features/User/userSlice";
import { loginAPI } from "utils/WebAPI";

const useLogin = () => {
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
            console.error("Login failed", error);
        },
    });

    const handleLogin = (data) => {
        loginMutate(data);
    };

    return { handleLogin, loginIsError, loginIsPending };
};

export default useLogin;

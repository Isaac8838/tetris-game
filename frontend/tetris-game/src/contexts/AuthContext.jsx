import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, renewTokenAPI, createUserAPI } from "WebAPI";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        accessToken: localStorage.getItem("access_token"),
        accessTokenExpiresAt: localStorage.getItem("access_token_expires_at"),
        refreshToken: localStorage.getItem("refresh_token"),
        refreshTokenExpiresAt: localStorage.getItem("refresh_token_expires_at"),
        user: localStorage.getItem("user"),
        isAuthenticated: !!localStorage.getItem("access_token"),
    });

    const update_token = ({
        access_token,
        access_token_expires_at,
        refresh_token,
        refresh_token_expires_at,
        user,
    }) => {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem(
            "access_token_expires_at",
            access_token_expires_at
        );
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem(
            "refresh_token_expires_at",
            refresh_token_expires_at
        );
        // 如果是refreshtoken 會沒有user資料
        if (user) localStorage.setItem("user", JSON.stringify(user));
        console.log("user", user);
        setAuthState((prev) => ({
            accessToken: access_token,
            accessTokenExpiresAt: access_token_expires_at,
            refreshToken: refresh_token,
            refreshTokenExpiresAt: refresh_token_expires_at,
            user: user || prev.user,
            isAuthenticated: true,
        }));
    };

    const navigate = useNavigate();

    const register = async (formData) => {
        try {
            const response = await createUserAPI(formData);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            // console.log("User created successfully:", data);
            console.log("User created successfully");

            login(formData);

            // 重新導向
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const login = async (formData) => {
        try {
            const response = await loginAPI(formData);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            // 儲存到localstorage和跟新authState
            update_token(data);
            navigate("/home");
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_expires_at");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("refresh_token_expires_at");
        localStorage.removeItem("user");

        setAuthState({
            accessToken: null,
            accessTokenExpiresAt: null,
            refreshToken: null,
            refreshTokenExpiresAt: null,
            user: null,
            isAuthenticated: false,
        });
    };

    const checkAndRenewToken = useCallback(async () => {
        if (authState.isAuthenticated) {
            const now = new Date();
            // 沒到期
            console.log("沒到期");
            if (new Date(authState.accessTokenExpiresAt) > now) return true;
            try {
                console.log("到期，請後端延長");
                // 到期，請後端延長
                const response = await renewTokenAPI();
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                update_token(data);
                return true;
            } catch (error) {
                // 延長失敗(重新登入)
                console.error("延長失敗(重新登入)", error);
                logout();
                navigate("/login");
                return false;
            }
        }
    }, [authState, navigate]);

    useEffect(() => {
        // 檢查access token

        checkAndRenewToken();
        const intervalId = setInterval(checkAndRenewToken, 5 * 1000);

        return () => clearInterval(intervalId);
    }, [checkAndRenewToken]);

    const value = {
        authState,
        register,
        login,
        logout,
        checkAndRenewToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

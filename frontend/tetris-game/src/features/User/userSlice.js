import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        username: localStorage.getItem("username") || "",
        access_token: localStorage.getItem("access_token") || "",
        access_token_expires_at:
            localStorage.getItem("access_token_expires_at") || "",
        refresh_token: localStorage.getItem("refresh_token") || "",
        refresh_token_expires_at:
            localStorage.getItem("refresh_token_expires_at") || "",
        isAuthenticated:
            localStorage.getItem("isAuthenticated") === "true" || false,
    },
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.access_token = action.payload.access_token;
            state.access_token_expires_at =
                action.payload.access_token_expires_at;
            state.refresh_token = action.payload.refresh_token;
            state.refresh_token_expires_at =
                action.payload.refresh_token_expires_at;
            state.isAuthenticated = true;

            localStorage.setItem("username", action.payload.username);
            localStorage.setItem("access_token", action.payload.access_token);
            localStorage.setItem(
                "access_token_expires_at",
                action.payload.access_token_expires_at,
            );
            localStorage.setItem("refresh_token", action.payload.refresh_token);
            localStorage.setItem(
                "refresh_token_expires_at",
                action.payload.refresh_token_expires_at,
            );
            localStorage.setItem("isAuthenticated", "true");
        },
        clearUser: (state) => {
            state.username = "";
            state.access_token = "";
            state.access_token_expires_at = "";
            state.refresh_token = "";
            state.refresh_token_expires_at = "";
            state.isAuthenticated = false;

            localStorage.removeItem("username");
            localStorage.removeItem("access_token");
            localStorage.removeItem("access_token_expires_at");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("refresh_token_expires_at");
            localStorage.setItem("isAuthenticated", "false");
        },
        setToken: (state, action) => {
            state.access_token = action.payload.access_token;
            state.access_token_expires_at =
                action.payload.access_token_expires_at;
            state.refresh_token = action.payload.refresh_token;
            state.refresh_token_expires_at =
                action.payload.refresh_token_expires_at;

            localStorage.setItem("access_token", action.payload.access_token);
            localStorage.setItem(
                "access_token_expires_at",
                action.payload.access_token_expires_at,
            );
            localStorage.setItem("refresh_token", action.payload.refresh_token);
            localStorage.setItem(
                "refresh_token_expires_at",
                action.payload.refresh_token_expires_at,
            );
        },
    },
});

export const { setUser, clearUser, setToken } = userSlice.actions;
export default userSlice.reducer;

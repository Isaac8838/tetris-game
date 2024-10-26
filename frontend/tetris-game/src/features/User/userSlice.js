import { renewTokenAPI } from "@/utils/WebAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const updateTokenThunk = createAsyncThunk(
    "user/updateToken",
    async (_, { getState, dispatch }) => {
        const {
            access_token_expires_at,
            refresh_token,
            refresh_token_expires_at,
        } = getState().user;

        const now = new Date();
        // 檢查 access_token_expires_at 是否有效
        if (
            !access_token_expires_at ||
            isNaN(new Date(access_token_expires_at))
        ) {
            console.error("access_token_expires_at is invalid");
            dispatch(clearUser());
            window.location.href = "/login";
            return;
        }

        // 檢查 refresh_token_expires_at 是否有效
        if (
            !refresh_token_expires_at ||
            isNaN(new Date(refresh_token_expires_at))
        ) {
            console.error("refresh_token_expires_at is invalid");
            dispatch(clearUser());
            window.location.href = "/login";
            return;
        }

        //token過期
        if (now >= new Date(access_token_expires_at)) {
            //都過期了，重新登入
            if (now >= new Date(refresh_token_expires_at)) {
                dispatch(clearUser());
                window.location.href = "/login";
                return;
            }

            try {
                const newTokens = await renewTokenAPI({ refresh_token });
                dispatch(setToken(newTokens));
            } catch (error) {
                console.error(error);
            }
        }
    },
);

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
        skinId: 0,
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
            // state.username = "";
            state.access_token = "";
            state.access_token_expires_at = "";
            state.refresh_token = "";
            state.refresh_token_expires_at = "";
            state.isAuthenticated = false;

            // localStorage.removeItem("username");
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
        changeSkin: (state, action) => {
            state.skinId = action.payload;
        },
        setUsername: (state, action) => {
            //註冊帳號時，事先設定username
            state.username = action.payload;
            localStorage.setItem("username", action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateTokenThunk.fulfilled, () => {});
    },
});

export const { setUser, clearUser, setToken, changeSkin, setUsername } =
    userSlice.actions;
export default userSlice.reducer;

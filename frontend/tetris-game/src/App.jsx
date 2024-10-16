import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import store from "@/utils/store";
import AppLayout from "@/ui/AppLayout";
import PrivateRoute from "@/utils/PrivateRoute";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Rank from "@/pages/Rank";
import ListScore from "@/pages/ListScore";
import Achievement from "@/pages/Achievement";
import Room from "./pages/Room";
import TetrominoStore from "./pages/TetrominoStore";
import MultiplayerHost from "./pages/MultiplayerHost";
import MultiplayerClient from "./pages/MultiplayerClient";

export default function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to="/login" />}
                        ></Route>
                        <Route path="/login" element={<Login />}></Route>

                        <Route element={<PrivateRoute />}>
                            <Route element={<AppLayout />}>
                                <Route path="/home" element={<Home />} />
                                <Route path="/game" element={<Game />} />
                                <Route path="/room" element={<Room />} />
                                <Route
                                    path="/host"
                                    element={<MultiplayerHost />}
                                />
                                <Route
                                    path="/join/:room_id"
                                    element={<MultiplayerClient />}
                                />
                                {/* <Route
                                    path="/multiplayerGame"
                                    element={<MultiplayerGame />}
                                /> */}
                                <Route path="/rank" element={<Rank />} />

                                <Route
                                    path="/listScore"
                                    element={<ListScore />}
                                />
                                <Route
                                    path="/achievement"
                                    element={<Achievement />}
                                />
                                <Route
                                    path="/store"
                                    element={<TetrominoStore />}
                                />
                            </Route>
                        </Route>
                        <Route path="*" element={<div>404</div>}></Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    );
}

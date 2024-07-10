import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useRoutes,
} from "react-router-dom";
import routetable from "./routes/routetable";

import "./App.css";
import AppLayout from "ui/AppLayout";
import Login from "pages/Login";
import Signup from "pages/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "store";
import PrivateRoute from "utils/PrivateRoute";
import Home from "pages/Home";
import Game from "pages/Game";
import Rank from "pages/Rank";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export default function App() {
    // 使用路遊註冊表

    // const element = useRoutes(routetable);
    // return <div className="app">{element}</div>;
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
                        <Route path="/signup" element={<Signup />}></Route>
                        <Route element={<PrivateRoute />}>
                            <Route element={<AppLayout />}>
                                <Route path="/home" element={<Home />} />
                                <Route path="/game" element={<Game />} />
                                <Route path="/rank" element={<Rank />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<div>404</div>}></Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    );
}

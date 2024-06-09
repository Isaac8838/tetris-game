import "./App.css";
import { useRoutes } from "react-router-dom";
import routetable from "./routes/routetable";
import { useEffect } from "react";

export default function App() {
    // 使用路遊註冊表

    const element = useRoutes(routetable);
    return <div className="app">{element}</div>;
}

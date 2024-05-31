import React, { useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = formData;
        try {
            const response = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("User logged in successfully:", data);
            // 重新導向
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };
    return (
        <div className="login-container">
            <div className="left-container">
                <h2>Welcom</h2>
                <div className="left-container-content">
                    This is left-content This is left-content This is
                    left-content This is left-content This is left-content
                </div>
            </div>
            <div className="right-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label>Username</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">
                        Login
                    </button>
                </form>
                <Link to="/signup" className="link-signup">
                    Go to Sign Up
                </Link>
            </div>
        </div>
    );
};

export default Login;

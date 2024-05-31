import React, { useState } from "react";
import "./index.css";

import { Link } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        repeatPassword: "",
        email: "",
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password, repeatPassword, email } = formData;

        if (password !== repeatPassword) {
            alert("Passwords do not match");
            return;
        }

        const userData = {
            username,
            password,
            email,
        };

        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("User created successfully:", data);
            // 重新導向
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
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
                <div className="input-box">
                    <label>Repeat Password</label>
                    <input
                        type="password"
                        id="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <label>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account?<Link to="/login">Log in</Link>
            </p>
        </div>
    );
};

export default Signup;

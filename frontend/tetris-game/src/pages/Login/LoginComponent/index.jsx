import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import styles from "../index.module.scss";

const LoginComponent = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const { login } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        login(formData);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles["login__form"]}>
                <div className={styles["input-box"]}>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        required
                    />
                    <span
                        className={`${styles["input-box__icon"]} ${styles["input-box__icon--login"]}`}
                    ></span>
                </div>
                <div className={styles["input-box"]}>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                    />
                    <span
                        className={`${styles["input-box__icon"]} ${styles["input-box__icon--password"]}`}
                    ></span>
                </div>
                <button type="submit" className="btn btn--black">
                    Login &rarr;
                </button>
            </form>
            <p>
                Don't have an account?{" "}
                <Link
                    to="/login/signupComponent"
                    className={styles["left-box__link"]}
                >
                    Create an account
                </Link>
            </p>
        </>
    );
};

export default LoginComponent;

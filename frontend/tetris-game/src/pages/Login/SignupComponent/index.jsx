import { useState, useContext } from "react";
import styles from "../index.module.scss";
import { AuthContext } from "contexts/AuthContext";

const SignupComponent = () => {
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

    const { register } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { password, repeatPassword } = formData;
        if (password !== repeatPassword) {
            alert("Passwords do not match");
            return;
        }
        register(formData);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles["register__form"]}>
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
                <div className={styles["input-box"]}>
                    <input
                        type="password"
                        id="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        required
                    />
                    <span
                        className={`${styles["input-box__icon"]} ${styles["input-box__icon--confirm-password"]}`}
                    ></span>
                </div>
                <div className={styles["input-box"]}>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email"
                        required
                    />
                    <span
                        className={`${styles["input-box__icon"]} ${styles["input-box__icon--email"]}`}
                    ></span>
                </div>
                <button type="submit" className="btn btn--black">
                    Register
                </button>
            </form>
        </>
    );
};

export default SignupComponent;

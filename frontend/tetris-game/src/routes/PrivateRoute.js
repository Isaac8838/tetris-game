import { useContext } from "react";
import { AuthContext } from "contexts/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { authState } = useContext(AuthContext);

    return authState.isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;

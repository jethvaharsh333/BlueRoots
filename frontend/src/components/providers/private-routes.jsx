import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const PrivateRoute = ({ children, role, allowedRoles }) => {
    const token = Cookies.get("accessToken");

    if (!token) {
        toast.error("You are not authenticated.");
        return <Navigate to="/login" replace />;
    }

    const userRole = localStorage.getItem("role");
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        toast.error("You are not authorized.");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
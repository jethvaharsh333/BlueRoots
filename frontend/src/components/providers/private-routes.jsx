// src/components/providers/private-routes.jsx
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  
  // 1. Check for authentication token
  const token = Cookies.get("accessToken");
  if (!token) {
    toast.error("You must be logged in to view this page.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check for user role authorization
  const userRole = localStorage.getItem("role");
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    toast.error("You are not authorized to access this page.");
    // IMPORTANT: Redirect to an unauthorized page, not the homepage.
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If all checks pass, render the protected component (e.g., the Layout)
  return children;
};

export default PrivateRoute;
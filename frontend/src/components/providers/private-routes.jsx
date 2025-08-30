<<<<<<< Updated upstream
// src/components/providers/private-routes.jsx
=======
// import { Navigate, useLocation } from "react-router-dom";
// import Cookies from "js-cookie";
// import toast from "react-hot-toast";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const location = useLocation();
//   const token = Cookies.get("accessToken");
//   console.log("PrivateRoute - Token:", token);

//   if (!token) {
//     toast.error("You are not authenticated.");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
// console.log("PrivateRoute - Allowed Roles:", allowedRoles);
//   const userRole = localStorage.getItem("role");
//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     toast.error("You are not authorized.");
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;


>>>>>>> Stashed changes
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
<<<<<<< Updated upstream
  
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
=======
  const token = Cookies.get("accessToken");
  const userRole = localStorage.getItem("role");

  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("PrivateRoute - Token:", token);
    console.log("PrivateRoute - Allowed Roles:", allowedRoles);
    console.log("PrivateRoute - User Role:", userRole);
    if (!token) {
      setError("auth");
      toast.error("You are not authenticated.");
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      setError("unauthorized");
      toast.error("You are not authorized.");
    }
  }, [token, userRole, allowedRoles]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

>>>>>>> Stashed changes
  return children;
};

export default PrivateRoute;
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useEffect } from "react";

const PrivateRoute = ({ children, role, allowedRoles }) => {
  const token = Cookies.get("accessToken");
  const userRole = localStorage.getItem("role");

  // Run side effects (like toast) only in useEffect
  useEffect(() => {
    if (!token) {
      toast.error("You are not authenticated.");
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      toast.error("You are not authorized.");
    }
  }, [token, userRole, allowedRoles]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import toast from "react-hot-toast";

// const PrivateRoute = ({ children, role, allowedRoles }) => {
//     const token = Cookies.get("accessToken");

//     if (!token) {
//         toast.error("You are not authenticated.");
//         return <Navigate to="/login" replace />;
//     }

//     const userRole = localStorage.getItem("role");
//     if (allowedRoles && !allowedRoles.includes(userRole)) {
//         toast.error("You are not authorized.");
//         return <Navigate to="/" replace />;
//     }

//     return children;
// };

// export default PrivateRoute;
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


import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
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

  return children;
};

export default PrivateRoute;

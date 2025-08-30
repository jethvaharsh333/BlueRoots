import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UnauthorizedException, ForbiddenException } from "../utils/ApiError.js";
import { UserRole } from "../models/user-role.model.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const authenticator = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return asyncHandler(async (req, res, next) => {
    console.log("current user -----------------> ")
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return ApiResponse.failure("Authentication failed. Please login again.", HTTPSTATUS.UNAUTHORIZED).send(res);
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return ApiResponse.failure("Invalid or expired token.", HTTPSTATUS.UNAUTHORIZED).send(res);
      // throw new UnauthorizedException("Invalid or expired token.");
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      return ApiResponse.failure("Authentication failed. Please login again.", HTTPSTATUS.UNAUTHORIZED).send(res);
      // throw new UnauthorizedException("Authentication failed. Please login again.");
    }

    console.log("user: " + user);

    if (roles.length > 0) {
      const userRoles = await UserRole.find({ userId: user._id }).populate("roleId");

      const roleNames = userRoles.map(ur => ur.roleId.roleName);

      const hasRole = roles.some(role => roleNames.includes(role));

      if (!hasRole) {
        throw new ForbiddenException("You do not have permission to access this resource.");
      }
    }

    req.user = user;

    console.log("USER MIDDLEWARE:", user.email, "Roles:", roles);
    next();
  });
};

export { authenticator };

/*
  router.get("/mod-or-admin", authenticator(["admin", "moderator"]), (req, res) => {
    res.json({ message: "You are admin or moderator" });
  });
*/

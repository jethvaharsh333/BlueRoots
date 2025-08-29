import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserRole } from "../models/UserRole.js";
import { UnauthorizedException, ForbiddenException } from "../utils/ApiError.js";

const authenticator = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return asyncHandler(async (req, _, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException("Authentication failed. Please login again.");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token.");
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new UnauthorizedException("Authentication failed. Please login again.");
    }

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

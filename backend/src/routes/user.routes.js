import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAllUsers, getCitizenDashboard, getCurrentUser, getGovernmentDashboard, getNgoDashboard, logout, updatePassword, updateProfile } from "../controllers/user.controller.js";
import { authenticator } from "../middlewares/authenticator.middleware.js";

const router = Router();
router.use(authenticator());

router.route("/current").get(asyncHandler(getCurrentUser));
router.route("/logout").post(asyncHandler(logout));
router.route("/update-profile").put(asyncHandler(updateProfile));
router.route("/update-password").put(asyncHandler(updatePassword));
router.route("/").get(asyncHandler(getAllUsers));

router.route("/citizen").get(asyncHandler(getCitizenDashboard));
router.route("/ngo").get(asyncHandler(getNgoDashboard));
router.route("/government").get(asyncHandler(getGovernmentDashboard));

export default router;
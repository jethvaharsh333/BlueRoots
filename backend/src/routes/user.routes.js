import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCurrentUser, logout, updatePassword, updateProfile } from "../controllers/user.controller.js";
import { authenticator } from "../middlewares/authenticator.middleware.js";

const router = Router();
router.use(authenticator());

router.route("/current").get(asyncHandler(getCurrentUser));
router.route("/logout").post(asyncHandler(logout));
router.route("/update-profile").post(asyncHandler(updateProfile));
router.route("/update-password").post(asyncHandler(updatePassword));

export default router;
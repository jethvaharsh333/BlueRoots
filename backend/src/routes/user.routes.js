import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCurrentUser, logout } from "../controllers/user.controller.js";
import { authenticator } from "../middlewares/authenticator.middleware.js";

const router = Router();
router.use(authenticator());

router.route("/current").get(asyncHandler(getCurrentUser));
router.route("/logout").post(asyncHandler(logout));

export default router;
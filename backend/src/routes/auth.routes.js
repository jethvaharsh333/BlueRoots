import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { forgotPassword, generateAccessToken, googleAuth, googleCallback, login, register, resendVerificationCode, resetPassword, verifyEmail } from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(asyncHandler(register));
router.route("/verify-email").post(asyncHandler(verifyEmail));
router.route("/resend-verify-email").post(asyncHandler(resendVerificationCode));
router.route("/login").post(asyncHandler(login));
router.route("/forgot-password").post(asyncHandler(forgotPassword));
router.route("/reset-password").post(asyncHandler(resetPassword));

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

router.route("/generate-access-token").get(generateAccessToken);    

export default router;
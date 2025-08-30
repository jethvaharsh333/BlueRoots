import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCloudinarySignature } from "../controllers/config.controller.js";

const router = Router();

router.route("/cloudinary-signature").get(asyncHandler(getCloudinarySignature));

export default router;
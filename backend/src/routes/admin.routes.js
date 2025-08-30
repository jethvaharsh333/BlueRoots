import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticator } from "../middlewares/authenticator.middleware.js";
import { createUser } from "../controllers/admin.controller.js";

const router = Router();
router.use(authenticator(["GOVERNMENT"]));

router.route("/create-user").post(asyncHandler(createUser));

export default router;
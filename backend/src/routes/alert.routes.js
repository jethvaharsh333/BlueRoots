import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createAlert, getAlertById, getAllAlerts } from "../controllers/alert.controller.js";
import { authenticator } from "../middlewares/authenticator.middleware.js";

const router = Router();

router.route("/:id").get( authenticator("NGO"), asyncHandler(getAlertById));
router.route("/all").get(asyncHandler(getAllAlerts));
router.route("/").post(authenticator("NGO"), createAlert);    

export default router;
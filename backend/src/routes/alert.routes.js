import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createAlert, getAlertById, getAllAlerts } from "../controllers/alert.controller.js";

const router = Router();

router.route("/:id").get(asyncHandler(getAlertById));
router.route("/all").get(asyncHandler(getAllAlerts));
router.route("/create").post(createAlert);    

export default router;
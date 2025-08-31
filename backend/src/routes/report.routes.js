import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticator } from "../middlewares/authenticator.middleware.js";
import { createReport, getAllReports, getMyReports, getReportById, verifyReport } from "../controllers/report.controller.js";

const router = Router();
router.use(authenticator());

router.route('/create').post(authenticator(['CITIZEN']), asyncHandler(createReport));
router.route('/my').get(authenticator(['CITIZEN']), asyncHandler(getMyReports));

router.route('/all').get(authenticator(['NGO','GOVERNMENT']), asyncHandler(getAllReports));
router.route('/:id').get(authenticator(), asyncHandler(getReportById));
router.route('/verify/:id').put(authenticator(['NGO']), asyncHandler(verifyReport));

export default router;
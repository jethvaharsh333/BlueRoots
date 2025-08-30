import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLeaderboardPoints } from "../controllers/leaderboard.controller.js";

const router = Router();

router.route("/").get(asyncHandler(getLeaderboardPoints));    

export default router;
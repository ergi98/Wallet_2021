import express from "express";

// Controller
import { getHomeStatistics } from "../controllers/transaction-controller.js";

const router = express.Router();

router.route("/home-statistics").get(getHomeStatistics);

export default router;

import express from "express";

// Controller
import {
	getHomeStatistics,
	createEarningTransaction,
} from "../controllers/transaction-controller.js";

const router = express.Router();

// GET
router.route("/home-statistics").get(getHomeStatistics);

// POST
router.route("/earning").post(createEarningTransaction);

export default router;

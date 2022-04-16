import express from "express";

// Controller
import {
	getHomeStatistics,
	createEarningTransaction,
	createExpenseTransaction,
	createTransferTransaction,
} from "../controllers/transaction-controller.js";

const router = express.Router();

// GET
router.route("/home-statistics").get(getHomeStatistics);

// POST
router.route("/earning").post(createEarningTransaction);
router.route("/expense").post(createExpenseTransaction);
router.route("/transfer").post(createTransferTransaction);

export default router;

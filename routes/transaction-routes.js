import express from "express";

// Controller
import {
	getHomeStatistics,
	createEarning,
	createExpense,
	createTransfer,
	deleteTransaction,
} from "../controllers/transaction-controller.js";

const router = express.Router();

// GET
router.route("/home-statistics").get(getHomeStatistics);

// POST
router.route("/earning").post(createEarning);
router.route("/expense").post(createExpense);
router.route("/transfer").post(createTransfer);

// DELETE
router.route("/delete").delete(deleteTransaction);

export default router;

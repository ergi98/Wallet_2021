import express from "express";

// Controller
import {
	createEarning,
	createExpense,
	createTransfer,
	correctEarning,
	correctExpense,
	getTransactions,
	deleteTransaction,
	getHomeStatistics,
} from "../controllers/transaction-controller.js";

const router = express.Router();

// GET
router.route("/home-statistics").get(getHomeStatistics);

// POST
router.route("/get-all").post(getTransactions);

router.route("/earning").post(createEarning);
router.route("/expense").post(createExpense);
router.route("/transfer").post(createTransfer);

router.route("/correct-earning").post(correctEarning);
router.route("/correct-expense").post(correctExpense);

// DELETE
router.route("/delete").delete(deleteTransaction);

export default router;

import express from "express";

// Controller
import {
	getHomeStatistics,
	createTransaction,
} from "../controllers/transaction-controller.js";

const router = express.Router();

// GET
router.route("/home-statistics").get(getHomeStatistics);

// POST
router.route("/create").post(createTransaction);

export default router;

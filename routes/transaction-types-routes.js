import express from "express";

// Controller
import { getTransactionTypes } from "../controllers/transaction-types-controller.js";

const router = express.Router();

// GET
router.route("/get-all").get(getTransactionTypes);

export default router;

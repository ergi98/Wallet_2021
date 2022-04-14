import express from "express";

// Controller
import { getCurrencyListWithLatestRates } from "../controllers/currency-controller.js";

const router = express.Router();

// GET
router.route("/rates").get(getCurrencyListWithLatestRates);

export default router;

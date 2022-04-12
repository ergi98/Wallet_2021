import express from "express";

// Controller
import {
	getCurrencyRates,
	populateRatesFromBOA,
} from "../controllers/currency-controller.js";

const router = express.Router();

// GET
router.route("/rates").get(getCurrencyRates);
router.route("/populate").get(populateRatesFromBOA);

export default router;

import express from "express";

// Controller
import { populateRatesFromBOA } from "../controllers/currency-rates-controller.js";

const router = express.Router();

// GET
router.route("/populate").get(populateRatesFromBOA);

export default router;

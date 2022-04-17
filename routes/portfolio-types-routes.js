import express from "express";

// Controller
import { getPortfolioTypes } from "../controllers/portfolio-types-controller.js";

const router = express.Router();

// GET
router.route("/get-all").get(getPortfolioTypes);

export default router;

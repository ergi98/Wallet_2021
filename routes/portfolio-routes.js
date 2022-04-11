import express from "express";

// Controller
import {
	getPortfolios,
	createPortfolio,
} from "../controllers/portfolio-controller.js";

const router = express.Router();

router.route("/create").post(createPortfolio);
router.route("/get-portfolios").get(getPortfolios);

export default router;

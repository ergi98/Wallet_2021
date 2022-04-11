import express from "express";

// Controller
import {
	getPortfolios,
	createPortfolio,
	getPortfolioById,
} from "../controllers/portfolio-controller.js";

const router = express.Router();

router.route("/create").post(createPortfolio);
router.route("/get-portfolios").get(getPortfolios);
router.route("/get-portfolio-by-id").get(getPortfolioById);

export default router;

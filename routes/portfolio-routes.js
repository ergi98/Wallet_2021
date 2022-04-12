import express from "express";

// Controller
import {
	getPortfolios,
	createPortfolio,
	deletePortfolio,
	getPortfolioById,
	editPortfolio,
	restorePortfolio,
} from "../controllers/portfolio-controller.js";

const router = express.Router();

// GET
router.route("/get-all").get(getPortfolios);
router.route("/get-by-id").get(getPortfolioById);

// POST
router.route("/edit").post(editPortfolio);
router.route("/create").post(createPortfolio);
router.route("/restore").post(restorePortfolio);

// DELETE
router.route("/delete").delete(deletePortfolio);

export default router;

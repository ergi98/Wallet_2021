import express from "express";

// Controller
import {
	editCategory,
	getCategories,
	deleteCategory,
	createCategory,
	restoreCategory,
} from "../controllers/category-controller.js";

const router = express.Router();

// GET
router.route("/get-all").get(getCategories);

// POST
router.route("/edit").post(editCategory);
router.route("/create").post(createCategory);
router.route("/restore").post(restoreCategory);

// DELETE
router.route("/delete").delete(deleteCategory);

export default router;

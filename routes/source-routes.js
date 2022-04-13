import express from "express";

// Controller
import {
	getSources,
	createSource,
	editSource,
	deleteSource,
} from "../controllers/source-controller.js";

const router = express.Router();

// GET
router.route("/get-all").get(getSources);

// POST
router.route("/edit").post(editSource);
router.route("/create").post(createSource);

// DELETE
router.route("/delete").delete(deleteSource);

export default router;

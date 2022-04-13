import express from "express";

// Controller
import {
	getSources,
	editSource,
	deleteSource,
	createSource,
	restoreSource,
} from "../controllers/source-controller.js";

const router = express.Router();

// GET
router.route("/get-all").get(getSources);

// POST
router.route("/edit").post(editSource);
router.route("/create").post(createSource);
router.route("/restore").post(restoreSource);

// DELETE
router.route("/delete").delete(deleteSource);

export default router;

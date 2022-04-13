import express from "express";

// Controller
import {
	getUser,
	updateUser,
	deleteUser,
} from "../controllers/user-controller.js";

const router = express.Router();

// GET
router.route("/info").get(getUser);

// POST
router.route("/edit").post(updateUser);

// DELETE
router.route("/delete").delete(deleteUser);

export default router;

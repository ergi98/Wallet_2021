import express from "express";

// Controller
import {
	getUser,
	updateUser,
	deleteUser,
	changePassword,
} from "../controllers/user-controller.js";

const router = express.Router();

// GET
router.route("/info").get(getUser);

// POST
router.route("/edit").post(updateUser);
router.route("/change-password").post(changePassword);

// DELETE
router.route("/delete").delete(deleteUser);

export default router;

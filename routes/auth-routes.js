import {
	logIn,
	logOut,
	signUp,
	validateUsername,
} from "../controllers/auth-controller.js";
import express from "express";

const router = express.Router();

router.route("/log-in").post(logIn);
router.route("/sign-up").post(signUp);
router.route("/log-out").post(logOut);
router.route("/validate-username").get(validateUsername);

export default router;

// Express
import express from "express";

// Middleware
import tokenMiddleware from "../middleware/token-middleware.js";

// Controller
import {
	logIn,
	logOut,
	signUp,
	validateUsername,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/log-in").post(logIn);
router.route("/sign-up").post(signUp);
router.route("/log-out").post(tokenMiddleware, logOut);
router.route("/validate").get(validateUsername);

export default router;

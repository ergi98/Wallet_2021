import express from "express";

// Controller
import { getSources, createSource } from "../controllers/source-controller.js";

const router = express.Router();

// GET
router.route("/get-all").get(getSources);

// POST
router.route("/create").post(createSource);

// DELETE

export default router;

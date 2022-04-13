import express from "express";

// Controller
import { getBankList } from "../controllers/bank-controller.js";

const router = express.Router();

router.route("/get-all").get(getBankList);

export default router;

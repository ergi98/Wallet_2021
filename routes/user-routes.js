import express from "express";

const router = express.Router();

router.route("/").get(() => console.log("here in function"));

export default router;

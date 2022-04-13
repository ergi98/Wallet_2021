import mongoose from "mongoose";

// Schema
import sourcesSchema from "../schemas/sources-schema.js";

async function getSources(req, res) {
	try {
		const sources = await sourcesSchema
			.find({ user: mongoose.Types.ObjectId(req.headers.userId) })
			.select({ updatedAt: 0, user: 0 });

		res.status(200).send(sources);
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	}
}

async function createSource(req, res) {
	try {
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	}
}

export { getSources, createSource };

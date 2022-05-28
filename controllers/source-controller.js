import mongoose from "mongoose";

// Schema
import SourcesSchema from "../schemas/sources-schema.js";

// Validators
import {
	editSourceSchema,
	createSourceSchema,
} from "../validators/source-validators.js";
import { objectIdSchema } from "../validators/general-validators.js";

async function getSourcesHelper(userId) {
	const sources = await SourcesSchema.find({
		user: mongoose.Types.ObjectId(userId),
	}).select({ updatedAt: 0, user: 0 });
	return sources;
}

// Returns an not deleted source
async function getActiveSourceHelper(userId, sourceId) {
	const source = await SourcesSchema.findOne({
		deletedAt: { $exists: 0 },
		_id: mongoose.Types.ObjectId(sourceId),
		user: mongoose.Types.ObjectId(userId),
	}).select({ updatedAt: 0, user: 0 });

	return source;
}

async function getSources(req, res) {
	try {
		const sources = await getSourcesHelper(req.headers.userId);

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
		await createSourceSchema.validateAsync(req.body);

		let name = req.body.name.trim();

		const count = await SourcesSchema.count({
			name,
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (count !== 0) throw new Error("Source with this name already exists");

		const source = await SourcesSchema.create({
			name,
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		const { user, ...data } = source._doc;

		res.status(200).send(data);
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

async function editSource(req, res) {
	try {
		await editSourceSchema.validateAsync(req.body);

		const source = await SourcesSchema.findOne({
			deletedAt: { $exists: 0 },
			_id: mongoose.Types.ObjectId(req.body.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (source === null) throw new Error("Source does not exist");

		let name = req.body.name.trim();

		const count = await SourcesSchema.count({
			name,
			user: mongoose.Types.ObjectId(req.headers.userId),
			_id: { $ne: mongoose.Types.ObjectId(req.body.id) },
		});

		if (count !== 0) throw new Error("Source with this name already exists");

		const updatedSource = await SourcesSchema.findByIdAndUpdate(
			req.body.id,
			{
				$set: {
					name,
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					user: 0,
					updatedAt: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send(updatedSource);
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

async function deleteSource(req, res) {
	try {
		await objectIdSchema.validateAsync(req.query.id);

		const source = await SourcesSchema.findOne({
			deletedAt: { $exists: 0 },
			_id: mongoose.Types.ObjectId(req.query.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (source === null) throw new Error("Source does not exits");

		const deletedSource = await SourcesSchema.findByIdAndUpdate(
			source._doc._id,
			{
				$set: {
					deletedAt: new Date(),
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					user: 0,
					updatedAt: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send(deletedSource);
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

async function restoreSource(req, res) {
	try {
		await objectIdSchema.validateAsync(req.query.id);

		const source = await SourcesSchema.findOne({
			deletedAt: { $exists: 1 },
			_id: mongoose.Types.ObjectId(req.query.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (source === null) throw new Error("Source does not exits");

		const deletedSource = await SourcesSchema.findByIdAndUpdate(
			source._doc._id,
			{
				$unset: {
					deletedAt: "",
				},
				$set: {
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					user: 0,
					updatedAt: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send(deletedSource);
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

export {
	getSources,
	createSource,
	editSource,
	deleteSource,
	restoreSource,
	// HELPERS
	getSourcesHelper,
	getActiveSourceHelper,
};

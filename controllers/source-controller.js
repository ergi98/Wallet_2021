import mongoose from "mongoose";

// Schema
import SourcesSchema from "../schemas/sources-schema.js";
import { objectIdSchema } from "../validators/portfolio-validators.js";

// Validators
import {
	editSourceSchema,
	createSourceSchema,
} from "../validators/source-validators.js";

async function getSources(req, res) {
	try {
		const sources = await SourcesSchema.find({
			user: mongoose.Types.ObjectId(req.headers.userId),
		}).select({ updatedAt: 0, user: 0, __v: 0 });

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

		const { user, __v, ...data } = source._doc;

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

		let name = req.body.name.trim();

		const count = await SourcesSchema.count({
			name,
			user: mongoose.Types.ObjectId(req.headers.userId),
			_id: { $ne: mongoose.Types.ObjectId(req.body.id) },
		});

		if (count !== 0) throw new Error("Source with this name already exists");

		const source = await SourcesSchema.findByIdAndUpdate(
			req.body.id,
			{
				$set: {
					name,
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					__v: 0,
					user: 0,
					updatedAt: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send(source);
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
					__v: 0,
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
					__v: 0,
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

export { getSources, createSource, editSource, deleteSource, restoreSource };

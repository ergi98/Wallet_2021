import mongoose from "mongoose";

// Schema
import CategorySchema from "../schemas/category-schema.js";

// Validators
import {
	editSourceSchema,
	createSourceSchema,
} from "../validators/source-validators.js";
import { objectIdSchema } from "../validators/portfolio-validators.js";

// Returns an not deleted source
async function getActiveCategoryHelper(userId, sourceId) {
	const category = await CategorySchema.findOne({
		deletedAt: { $exists: 0 },
		_id: mongoose.Types.ObjectId(sourceId),
		user: mongoose.Types.ObjectId(userId),
	}).select({ updatedAt: 0, user: 0 });

	return category;
}

async function getCategories(req, res) {
	try {
		const sources = await CategorySchema.find({
			user: mongoose.Types.ObjectId(req.headers.userId),
		}).select({ updatedAt: 0, user: 0 });

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

async function createCategory(req, res) {
	try {
		await createSourceSchema.validateAsync(req.body);

		let name = req.body.name.trim();

		const count = await CategorySchema.count({
			name,
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (count !== 0) throw new Error("Category with this name already exists");

		const source = await CategorySchema.create({
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

async function editCategory(req, res) {
	try {
		await editSourceSchema.validateAsync(req.body);

		const source = await CategorySchema.findOne({
			deletedAt: { $exists: 0 },
			_id: mongoose.Types.ObjectId(req.body.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (source === null) throw new Error("Category does not exist");

		let name = req.body.name.trim();

		const count = await CategorySchema.count({
			name,
			user: mongoose.Types.ObjectId(req.headers.userId),
			_id: { $ne: mongoose.Types.ObjectId(req.body.id) },
		});

		if (count !== 0) throw new Error("Category with this name already exists");

		const updatedSource = await CategorySchema.findByIdAndUpdate(
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

async function deleteCategory(req, res) {
	try {
		await objectIdSchema.validateAsync(req.query.id);

		const source = await CategorySchema.findOne({
			deletedAt: { $exists: 0 },
			_id: mongoose.Types.ObjectId(req.query.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (source === null) throw new Error("Category does not exits");

		const deletedSource = await CategorySchema.findByIdAndUpdate(
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

async function restoreCategory(req, res) {
	try {
		await objectIdSchema.validateAsync(req.query.id);

		const source = await CategorySchema.findOne({
			deletedAt: { $exists: 1 },
			_id: mongoose.Types.ObjectId(req.query.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (source === null) throw new Error("Category does not exits");

		const deletedSource = await CategorySchema.findByIdAndUpdate(
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
	editCategory,
	getCategories,
	createCategory,
	deleteCategory,
	restoreCategory,
	getActiveCategoryHelper,
};

import mongoose from "mongoose";
import CurrencySchema from "../schemas/currency-schema.js";

// Schema
import UserSchema from "../schemas/user-schema.js";

// Validators
import {
	editUserSchema,
	passwordSchema,
} from "../validators/auth-validators.js";

// Controllers
import { hashPassword } from "./auth-controller.js";

async function getUser(req, res) {
	try {
		const user = await UserSchema.aggregate([
			{
				$match: {
					_id: mongoose.Types.ObjectId(req.headers.userId),
					deleteAt: { $exists: false },
				},
			},
			{
				$lookup: {
					from: "currencies",
					localField: "defaultCurrency",
					foreignField: "_id",
					as: "defaultCurrency",
				},
			},
			{
				$set: {
					defaultCurrency: { $arrayElemAt: ["$defaultCurrency", 0] },
				},
			},
			{
				$set: {
					"defaultCurrency.rateForALL": {
						$toDouble: "$defaultCurrency.rateForALL",
					},
				},
			},
			{
				$project: {
					password: 0,
					createdAt: 0,
					updatedAt: 0,
					lastLogIn: 0,
					lastLogOut: 0,
					refresh: 0,
					"defaultCurrency.updatedAt": 0,
				},
			},
		]);

		if (user.length === 0) throw new Error("User not found");

		res.status(200).send(user[0]);
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

async function updateUser(req, res) {
	try {
		await editUserSchema.validateAsync(req.body);

		const user = await UserSchema.findById(req.headers.userId);

		if (user === null || user.deletedAt !== undefined)
			throw new Error("User not found");

		req.body.defaultCurrency = mongoose.Types.ObjectId(
			req.body.defaultCurrency
		);

		const updatedUser = await UserSchema.findByIdAndUpdate(
			user._doc._id,
			{
				$set: {
					...req.body,
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					refresh: 0,
					password: 0,
					updatedAt: 0,
					createdAt: 0,
					lastLogIn: 0,
					lastLogOut: 0,
				},
				returnDocument: "after",
			}
		);

		const defaultCurrency = await CurrencySchema.aggregate([
			{
				$match: {
					_id: updatedUser._doc.defaultCurrency,
				},
			},
			{
				$set: {
					rateForALL: { $ifNull: [{ $toDouble: "$rateForALL" }, 1] },
				},
			},
			{
				$project: {
					updatedAt: 0,
				},
			},
		]);

		if (defaultCurrency.length === 0)
			throw new Error("Could not find currency details");

		updatedUser._doc.defaultCurrency = defaultCurrency[0];

		res.status(200).send(updatedUser);
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

async function deleteUser(req, res) {
	try {
		const user = await UserSchema.findById(req.headers.userId);

		if (user === null || user.deletedAt !== undefined)
			throw new Error("User not found");

		await UserSchema.findByIdAndUpdate(user._doc._id, {
			$set: {
				deletedAt: new Date(),
			},
		});

		res.status(200).send();
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

async function changePassword(req, res) {
	try {
		await passwordSchema.validateAsync(req.body.password);

		const user = await UserSchema.findById(req.headers.userId);

		if (user === null || user.deletedAt !== undefined)
			throw new Error("User not found");

		req.body.password = await hashPassword(req.body.password);

		await UserSchema.findByIdAndUpdate(
			user._doc._id,
			{
				$set: {
					password: req.body.password,
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					refresh: 0,
					password: 0,
					updatedAt: 0,
					createdAt: 0,
					lastLogIn: 0,
					lastLogOut: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send();
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

export { getUser, deleteUser, updateUser, changePassword };

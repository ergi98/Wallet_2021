import mongoose from "mongoose";
import UserSchema from "../schemas/user-schema.js";
import { editUserSchema } from "../validators/auth-validators.js";

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
					__v: 0,
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

export { getUser, deleteUser, updateUser };

import mongoose from "mongoose";

// Validation
import {
	walletSchema,
	objectIdSchema,
	editWalletSchema,
	virtualWalletSchema,
	editVirtualWalletSchema,
} from "../validators/portfolio-validators.js";

// Aggregations
import { getPortfoliosAggregation } from "../aggregations/portfolio-aggregations.js";

// Schema
import PortfolioSchema from "../schemas/portfolio-schema.js";
import PortfolioTypesSchema from "../schemas/portfolio-types-schema.js";

async function getActivePortfolioHelper(userId, portfolioId) {
	const portfolio = await PortfolioSchema.findOne({
		_id: mongoose.Types.ObjectId(portfolioId),
		user: mongoose.Types.ObjectId(userId),
		deletedAt: { $exists: 0 },
	});
	return portfolio;
}

// If the portfolio currently holds some amount of the transaction currency
async function addInExistingCurrHelper(portfolioId, userId, amount, currency) {
	return await PortfolioSchema.findOneAndUpdate(
		{
			_id: portfolioId,
			user: userId,
			deletedAt: { $exists: 0 },
		},
		{
			$inc: {
				"amounts.$[index].amount": amount,
			},
		},
		{
			arrayFilters: [{ "index.currency": currency }],
		}
	);
}

// If it is the first time storing this amount on the wallet
async function createCurrencyEntryHelper(
	portfolioId,
	userId,
	amount,
	currency
) {
	return await PortfolioSchema.findOneAndUpdate(
		{
			_id: portfolioId,
			user: userId,
			deletedAt: { $exists: 0 },
		},
		{
			$push: {
				amounts: { currency, amount },
			},
		}
	);
}

async function createPortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.body.type);

		// First get the type of portfolio to determine what validation schema to use
		let portfolioType = await PortfolioTypesSchema.findById(req.body.type);
		if (portfolioType === null) throw new Error("Invalid portfolio type");

		portfolioType.type === "wallet"
			? await walletSchema.validateAsync(req.body)
			: await virtualWalletSchema.validateAsync(req.body);

		req.body.user = mongoose.Types.ObjectId(req.headers.userId);
		req.body.type = mongoose.Types.ObjectId(req.body.type);
		req.body.description = req.body.description.trim();

		let count, error;

		if (portfolioType.type === "wallet") {
			count = await PortfolioSchema.count({
				description: req.body.description,
				user: mongoose.Types.ObjectId(req.headers.userId),
			});
			count !== 0 &&
				(error = "Portfolio with the same description already exists");
		} else {
			count = await PortfolioSchema.count({
				$or: [
					{ cvc: req.body.cvc },
					{ cardNumber: req.body.cardNumber },
					{ description: req.body.description },
				],
				user: mongoose.Types.ObjectId(req.headers.userId),
			});
			count !== 0 &&
				(error =
					"Portfolio with the same description, cvc, or card number already exists");
		}

		if (count !== 0) throw new Error(error);

		const portfolio = await PortfolioSchema.create(req.body);

		await portfolio.populate("type");

		if (portfolioType.type !== "wallet") await portfolio.populate("bank");

		const { __v, user, ...data } = portfolio._doc;

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

// Retrieves deleted and active portfolios
async function getPortfolios(req, res) {
	try {
		const portfolios = await PortfolioSchema.aggregate(
			getPortfoliosAggregation(req.headers.userId)
		);

		for (let portfolio of portfolios) {
			portfolio.amounts = portfolio.amounts.filter(
				(amount) => amount.currency !== undefined
			);
		}

		res.status(200).send(portfolios);
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

// Retrieves deleted and active portfolio
async function getPortfolioById(req, res) {
	try {
		await objectIdSchema.validateAsync(req.query.id);

		const result = await PortfolioSchema.aggregate(
			getPortfoliosAggregation(req.headers.userId, req.query.id)
		);

		let portfolio = result[0];

		if (portfolio === undefined)
			throw new Error("Portfolio with this id does not exits");

		portfolio.amounts = portfolio.amounts.filter(
			(amount) => amount.currency !== undefined
		);

		res.status(200).send(portfolio);
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

async function deletePortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.query.id);

		const portfolio = await PortfolioSchema.findOne({
			deletedAt: { $exists: 0 },
			_id: mongoose.Types.ObjectId(req.query.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		if (portfolio === null)
			throw new Error("Portfolio with this id does not exits");

		const deletedPortfolio = await PortfolioSchema.findByIdAndUpdate(
			req.query.id,
			{
				$set: {
					deletedAt: new Date(),
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					__v: 0,
					updatedAt: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send(deletedPortfolio);
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

async function editPortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.body.id);

		const foundPortfolio = await PortfolioSchema.findOne({
			deletedAt: { $exists: 0 },
			_id: mongoose.Types.ObjectId(req.body.id),
			user: mongoose.Types.ObjectId(res.headers.userId),
		});

		// Checking if portfolio exists and is not deleted
		if (foundPortfolio === null) throw new Error("Portfolio does not exits");

		let portfolioType = await PortfolioTypesSchema.findById(
			foundPortfolio._doc.type
		);

		if (portfolioType === null)
			throw new Error("This portfolio does not have a valid type.");

		portfolioType.type === "wallet"
			? await editWalletSchema.validateAsync(req.body)
			: await editVirtualWalletSchema.validateAsync(req.body);

		let { id, ...fieldsToEdit } = req.body;

		fieldsToEdit.description = fieldsToEdit.description.trim();

		let count, error;

		if (portfolioType.type === "wallet") {
			count = await PortfolioSchema.count({
				description: fieldsToEdit.description,
				user: mongoose.Types.ObjectId(req.headers.userId),
				_id: { $ne: mongoose.Types.ObjectId(req.body.id) },
			});
			count !== 0 &&
				(error = "Portfolio with the same description already exists");
		} else {
			count = await PortfolioSchema.count({
				$or: [
					{ cvc: req.body.cvc },
					{ cardNumber: req.body.cardNumber },
					{ description: req.body.description },
				],
				user: mongoose.Types.ObjectId(req.headers.userId),
				_id: { $ne: mongoose.Types.ObjectId(req.body.id) },
			});
			count !== 0 &&
				(error =
					"Portfolio with the same description, cvc, or card number already exists");
		}

		if (count !== 0) throw new Error(error);

		const editedPortfolio = await PortfolioSchema.findByIdAndUpdate(
			foundPortfolio._doc._id,
			{
				$set: {
					...fieldsToEdit,
					updatedAt: new Date(),
				},
			},
			{
				projection: {
					__v: 0,
					updatedAt: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send(editedPortfolio);
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

async function restorePortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.body.id);

		const foundPortfolio = await PortfolioSchema.findById({
			deletedAt: { $exists: 1 },
			_id: mongoose.Types.ObjectId(req.body.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
		});

		// Checking if portfolio exists and is not deleted
		if (foundPortfolio === null) throw new Error("Portfolio does not exits");

		const restoredPortfolio = await PortfolioSchema.findByIdAndUpdate(
			foundPortfolio._doc._id,
			{
				$set: {
					updatedAt: new Date(),
				},
				$unset: {
					deletedAt: "",
				},
			},
			{
				projection: {
					__v: 0,
					createdAt: 0,
				},
				returnDocument: "after",
			}
		);

		res.status(200).send(restoredPortfolio);
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
	getPortfolios,
	editPortfolio,
	createPortfolio,
	deletePortfolio,
	getPortfolioById,
	restorePortfolio,
	// HELPERS
	addInExistingCurrHelper,
	getActivePortfolioHelper,
	createCurrencyEntryHelper,
};

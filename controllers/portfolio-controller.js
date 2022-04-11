import mongoose from "mongoose";

// Validation
import {
	typeSchema,
	virtualWalletSchema,
	walletSchema,
} from "../validators/portfolio-validators.js";

// Schema
import PortfolioTypesSchema from "../schemas/portfolio-types-schema.js";
import PortfolioSchema from "../schemas/portfolio-schema.js";

async function createPortfolio(req, res) {
	try {
		await typeSchema.validateAsync(req.body.type);
		let portfolioType = await PortfolioTypesSchema.findById(req.body.type);
		if (portfolioType === null) throw new Error("Invalid portfolio type");

		let { type } = portfolioType;

		type === "wallet"
			? await walletSchema.validateAsync(req.body)
			: await virtualWalletSchema.validateAsync(req.body);

		req.body.user = mongoose.Types.ObjectId(req.headers.userId);
		req.body.type = mongoose.Types.ObjectId(req.body.type);

		const portfolioCount = await PortfolioSchema.count({
			description: req.body.description,
		});

		if (portfolioCount !== 0)
			throw new Error("Portfolio with the same description already exists");

		const portfolio = await PortfolioSchema.create(req.body);

		res.status(200).send({ portfolio });
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}

async function getPortfolios(req, res) {
	try {
		const portfolios = await PortfolioSchema.aggregate([
			{
				$match: {
					user: mongoose.Types.ObjectId(req.headers.userId),
					deletedAt: { $exists: false },
				},
			},
			{
				$project: {
					user: 0,
					__v: 0,
				},
			},
			{
				$lookup: {
					from: "portfolio-types",
					localField: "type",
					foreignField: "_id",
					as: "type",
				},
			},
			{
				$set: {
					type: { $arrayElemAt: ["$type", 0] },
				},
			},
			{
				$set: {
					type: "$type.type",
				},
			},
			{
				$unwind: {
					path: "$amounts",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "currencies",
					foreignField: "_id",
					as: "amounts.currency",
					localField: "amounts.currency",
				},
			},
			{
				$set: {
					"amounts.currency": { $arrayElemAt: ["$amounts.currency", 0] },
					"amounts.amount": { $ifNull: [{ $toDouble: "$amounts.amount" }, 0] },
				},
			},
			{
				$group: {
					_id: "$_id",
					root: {
						$first: "$$ROOT",
					},
					amounts: {
						$push: "$amounts",
					},
				},
			},
			{
				$set: {
					"root.amounts": "$amounts",
				},
			},
			{
				$replaceRoot: { newRoot: "$root" },
			},
		]);

		for (let portfolio of portfolios) {
			portfolio.amounts = portfolio.amounts.filter(
				(amount) => amount.currency !== undefined
			);
		}

		res.status(200).send(portfolios);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}

export { createPortfolio, getPortfolios };

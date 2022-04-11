import mongoose from "mongoose";

// Validation
import {
	objectIdSchema,
	virtualWalletSchema,
	walletSchema,
} from "../validators/portfolio-validators.js";

// Aggregations
import { getPortfoliosAggregation } from "../aggregations/portfolio-aggregations.js";

// Schema
import PortfolioSchema from "../schemas/portfolio-schema.js";
import PortfolioTypesSchema from "../schemas/portfolio-types-schema.js";

async function createPortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.body.type);
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
		res.status(400).send(err);
	}
}

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
		res.status(400).send(err);
	}
}

export { createPortfolio, getPortfolios, getPortfolioById };

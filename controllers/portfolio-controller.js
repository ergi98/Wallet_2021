import mongoose from "mongoose";

// Validation
import {
	editVirtualWalletSchema,
	editWalletSchema,
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

		// Checks deleted and active portfolios
		const portfolioCount = await PortfolioSchema.count({
			description: req.body.description,
		});

		if (portfolioCount !== 0)
			throw new Error("Portfolio with the same description already exists");

		const portfolio = await PortfolioSchema.create(req.body);

		res.status(200).send(portfolio);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
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
		res.status(400).send(err);
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
		res.status(400).send(err);
	}
}

async function deletePortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.query.id);

		const portfolio = await PortfolioSchema.findById(req.query.id);

		if (portfolio === null)
			throw new Error("Portfolio with this id does not exits");
		else if (portfolio.deletedAt !== undefined)
			throw new Error("Portfolio with this id is already deleted");
		else if (portfolio.amounts.length !== 0)
			throw new Error("Portfolio cannot be deleted if it is not empty");

		const deletedPortfolio = await PortfolioSchema.findByIdAndUpdate(
			req.query.id,
			{
				$set: {
					deletedAt: new Date(),
					updatedAt: new Date(),
				},
			},
			{ returnDocument: "after" }
		);

		res.status(200).send(deletedPortfolio);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}

async function editPortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.body.id);

		const foundPortfolio = await PortfolioSchema.findById(req.body.id);

		// Checking if portfolio exists and is not deleted
		if (foundPortfolio === null)
			throw new Error("Portfolio with this id does not exits");
		else if (foundPortfolio.deletedAt !== undefined)
			throw new Error("Can not edit a deleted portfolio");

		let portfolioType = await PortfolioTypesSchema.findById(
			foundPortfolio._doc.type
		);

		if (portfolioType === null)
			throw new Error("This portfolio does not have a valid type.");

		let { type } = portfolioType;

		type === "wallet"
			? await editWalletSchema.validateAsync(req.body)
			: await editVirtualWalletSchema.validateAsync(req.body);

		let { id, ...fieldsToEdit } = req.body;

		const editedPortfolio = await PortfolioSchema.findByIdAndUpdate(
			foundPortfolio._doc._id,
			{
				$set: {
					...fieldsToEdit,
					updatedAt: new Date(),
				},
			},
			{ returnDocument: "after" }
		);

		res.status(200).send(editedPortfolio);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}

async function restorePortfolio(req, res) {
	try {
		await objectIdSchema.validateAsync(req.body.id);

		const foundPortfolio = await PortfolioSchema.findById(req.body.id);

		// Checking if portfolio exists and is not deleted
		if (foundPortfolio === null)
			throw new Error("Portfolio with this id does not exits");
		else if (foundPortfolio.deletedAt === undefined)
			throw new Error("Can not restore a portfolio that is not deleted");

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
			{ returnDocument: "after" }
		);

		res.status(200).send(restoredPortfolio);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}

export {
	getPortfolios,
	editPortfolio,
	createPortfolio,
	deletePortfolio,
	getPortfolioById,
	restorePortfolio,
};

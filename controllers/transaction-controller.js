// Mongoose
import mongoose from "mongoose";

// Utilities
import { exactDiff } from "../utilities/number.utilities.js";

// Validation
import {
	homeStatisticsSchema,
	earningTransactionSchema,
	expenseTransactionSchema,
	transferTransactionSchema,
} from "../validators/transaction-validators.js";
import { objectIdSchema } from "../validators/portfolio-validators.js";

// Aggregations
import { getTransactionsAggregation } from "../aggregations/transaction-aggregations.js";

// Helpers
import { getActiveSourceHelper } from "./source-controller.js";
import {
	addInExistingCurrHelper,
	getActivePortfolioHelper,
	getPortfolioByIdHelper,
} from "./portfolio-controller.js";

// Schema
import CurrencySchema from "../schemas/currency-schema.js";
import TransactionSchema from "../schemas/transaction-schema.js";
import TransactionTypesSchema from "../schemas/transaction-types-schema.js";

async function validateTransactionTypeHelper(typeId, expectedType) {
	const type = await TransactionTypesSchema.findById(typeId);
	if (type === null || type._doc.type !== expectedType)
		throw new Error("Invalid transaction type");
}

async function getTransactionByIdHelper(transactionId, userId) {
	const transactions = await TransactionSchema.aggregate(
		getTransactionsAggregation(transactionId, userId)
	);
	return transactions[0];
}

async function createEarningTransaction(req, res) {
	let session;
	try {
		await objectIdSchema.validateAsync(req.body.type);
		await validateTransactionTypeHelper(req.body.type, "earning");
		req.body.date = new Date(req.body.date);
		await earningTransactionSchema.validateAsync(req.body, { convert: false });

		// Validating source
		const source = await getActiveSourceHelper(
			req.headers.userId,
			req.body.source
		);
		if (source === null) throw new Error("Invalid transaction source");

		// Validating currency
		const currency = await CurrencySchema.findById(req.body.currency);
		if (currency === null) throw new Error("Invalid transaction currency");

		// Validating portfolio
		const portfolio = await getActivePortfolioHelper(
			req.headers.userId,
			req.body.portfolio
		);
		if (portfolio === null) throw new Error("Invalid transaction portfolio");

		session = await mongoose.startSession();

		let newTransaction, newPortfolio;

		await session.withTransaction(async () => {
			const createdAt = new Date();

			// Inserting Transaction
			const transaction = await TransactionSchema.create({
				createdAt,
				...req.body,
				user: mongoose.Types.ObjectId(req.headers.userId),
			});

			// Checking if the portfolio has an entry for this currency
			const hasExistingEntry = portfolio._doc.amounts.find((amount) =>
				mongoose.Types.ObjectId(amount.currency).equals(
					transaction._doc.currency
				)
			);

			// Adding new entry to portfolio amounts or incrementing the current one
			hasExistingEntry
				? await addInExistingCurrHelper(
						transaction._doc.portfolio,
						transaction._doc.user,
						transaction._doc.amount,
						transaction._doc.currency
				  )
				: await createCurrencyEntryHelper(
						transaction._doc.portfolio,
						transaction._doc.user,
						transaction._doc.amount,
						transaction._doc.currency
				  );

			newPortfolio = await getPortfolioByIdHelper(
				transaction._doc.portfolio,
				transaction._doc.user
			);

			newTransaction = await getTransactionByIdHelper(
				transaction._doc._id,
				transaction._doc.user
			);
		});

		res
			.status(200)
			.send({ transaction: newTransaction, portfolio: newPortfolio });
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	} finally {
		session && session.endSession();
	}
}

async function getHomeStatistics(req, res) {
	try {
		await homeStatisticsSchema.validateAsync(req.query);

		let end = new Date(req.query.end);
		let start = new Date(req.query.start);

		// EOD = End of day
		let EODTimestamp = new Date(req.query.end).setUTCDate(end.getUTCDate() - 1);
		// SOD = Start of day
		let SODTimestamp = new Date(req.query.start).setUTCDate(
			start.getUTCDate() - 1
		);

		let prevEnd = new Date(EODTimestamp);
		let prevStart = new Date(SODTimestamp);

		const getBoundaries = (start) => {
			let arr = [];
			for (let i = 6; i >= -1; i--) {
				let timestamp = new Date(start).setUTCDate(start.getUTCDate() - i);
				arr.push(new Date(timestamp));
			}
			return arr;
		};

		const boundaries = getBoundaries(start);

		const otherStages = [
			{
				$lookup: {
					from: "transaction-types",
					localField: "type",
					foreignField: "_id",
					as: "typeData",
				},
			},
			{
				$set: {
					type: { $arrayElemAt: ["$typeData", 0] },
				},
			},
			{
				$group: {
					_id: "$type.type",
					amount: { $sum: "$amountInDefault" },
				},
			},
			{
				$set: {
					type: "$_id",
					amount: { $toDouble: "$amount" },
				},
			},
			{
				$project: {
					_id: 0,
				},
			},
		];

		const transactionTypes = await TransactionTypesSchema.find({});

		let data = await TransactionSchema.aggregate([
			{
				$facet: {
					previous: [
						{
							$match: {
								user: mongoose.Types.ObjectId(req.headers.userId),
								date: {
									$gte: prevStart,
									$lte: prevEnd,
								},
								deletedAt: { $exists: 0 },
								correctedAt: { $exists: 0 },
								correctedBy: { $exists: 0 },
							},
						},
						...otherStages,
					],
					today: [
						{
							$match: {
								user: mongoose.Types.ObjectId(req.headers.userId),
								date: {
									$gte: start,
									$lte: end,
								},
								deletedAt: { $exists: 0 },
								correctedAt: { $exists: 0 },
								correctedBy: { $exists: 0 },
							},
						},
						...otherStages,
					],
					expenseChart: [
						{
							$match: {
								user: mongoose.Types.ObjectId(req.headers.userId),
								type: mongoose.Types.ObjectId(
									transactionTypes.find((el) => el.type === "expense")._id
								),
								deletedAt: { $exists: 0 },
								correctedAt: { $exists: 0 },
								correctedBy: { $exists: 0 },
							},
						},
						// Test this
						{
							$bucket: {
								groupBy: "$date",
								boundaries: boundaries,
								default: "other",
								output: {},
							},
						},
					],
					transactions: [
						{
							$match: {
								user: mongoose.Types.ObjectId(req.headers.userId),
								date: {
									$gte: start,
									$lte: end,
								},
								deletedAt: { $exists: 0 },
								correctedAt: { $exists: 0 },
								correctedBy: { $exists: 0 },
							},
						},
						{
							$sort: { date: -1 },
						},
						{
							$limit: 20,
						},
						{
							$set: {
								amount: {
									$toDouble: "$amount",
								},
								amountInDefault: {
									$toDouble: "$amountInDefault",
								},
								currencyRate: {
									$toDouble: "$currencyRate",
								},
							},
						},
						{
							$project: {
								journals: 0,
								user: 0,
							},
						},
						{
							$lookup: {
								from: "transactionTypes",
								foreignField: "_id",
								localField: "type",
								as: "type",
							},
						},
						{
							$set: {
								type: { $arrayElemAt: ["$type", 0] },
							},
						},
						{
							$lookup: {
								from: "sources",
								foreignField: "_id",
								localField: "source",
								as: "source",
							},
						},
						{
							$set: {
								source: { $arrayElemAt: ["$source", 0] },
							},
						},
						{
							$lookup: {
								from: "portfolios",
								foreignField: "_id",
								localField: "portfolio",
								as: "portfolio",
							},
						},
						{
							$set: {
								portfolio: { $arrayElemAt: ["$portfolio", 0] },
							},
						},
						{
							$lookup: {
								from: "currencies",
								foreignField: "_id",
								localField: "currency",
								as: "currency",
							},
						},
						{
							$set: {
								currency: { $arrayElemAt: ["$currency", 0] },
							},
						},
						{
							$set: {
								type: "$type.type",
								source: "$source.name",
								portfolio: "$portfolio.description",
							},
						},
					],
				},
			},
		]);

		data = data[0];

		const format = (arr) => {
			let obj = {};
			if (arr.length === 0) {
				for (let element of transactionTypes) {
					obj[element.type] = {
						amount: 0,
					};
				}
				return obj;
			} else {
				for (let element of arr) {
					obj[element.type] = {
						amount: element.amount,
					};
				}
				for (let element of transactionTypes) {
					if (obj[element.type] === undefined) {
						obj[element.type] = {
							amount: 0,
						};
					}
				}
				return obj;
			}
		};

		const calculatePercentChange = (today, previous) => {
			for (let element of transactionTypes) {
				let previousVal = previous[element.type]["amount"];
				let todayVal = today[element.type]["amount"];
				today[element.type]["percent"] =
					previousVal === 0
						? 0
						: (exactDiff(todayVal, previousVal) / previousVal) * 100;
			}
		};

		data.today = format(data.today);
		data.previous = format(data.previous);
		calculatePercentChange(data.today, data.previous);

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

export { getHomeStatistics, createEarningTransaction };

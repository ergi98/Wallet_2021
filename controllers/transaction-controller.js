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
import {
	addInExistingCurrHelper,
	getActivePortfolioHelper,
	createCurrencyEntryHelper,
	removeCurrencyEntryHelper,
	getPortfolioAmountsHelper,
	getTransactionPortfoliosHelper,
} from "./portfolio-controller.js";
import { getActiveSourceHelper } from "./source-controller.js";
import { getActiveCategoryHelper } from "./category-controller.js";

// Schema
import CurrencySchema from "../schemas/currency-schema.js";
import TransactionSchema from "../schemas/transaction-schema.js";
import TransactionTypesSchema from "../schemas/transaction-types-schema.js";

// Big Number
import BigNumber from "bignumber.js";

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

async function createEarning(req, res) {
	let session;
	try {
		await objectIdSchema.validateAsync(req.body.type);
		await validateTransactionTypeHelper(req.body.type, "earning");
		req.body.date = new Date(req.body.date ?? "");
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

			newPortfolio = await getPortfolioAmountsHelper(
				transaction._doc.user,
				transaction._doc.portfolio
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

async function createExpense(req, res) {
	let session;
	try {
		await objectIdSchema.validateAsync(req.body.type);
		await validateTransactionTypeHelper(req.body.type, "expense");
		req.body.date = new Date(req.body.date ?? "");
		await expenseTransactionSchema.validateAsync(req.body, { convert: false });

		// Validating category
		const category = await getActiveCategoryHelper(
			req.headers.userId,
			req.body.category
		);
		if (category === null) throw new Error("Invalid transaction category");

		// Validating currency
		const currency = await CurrencySchema.findById(req.body.currency);
		if (currency === null) throw new Error("Invalid transaction currency");

		// Validating portfolio
		const portfolio = await getActivePortfolioHelper(
			req.headers.userId,
			req.body.portfolio
		);
		if (portfolio === null) throw new Error("Invalid transaction portfolio");

		const portfolioAmount = portfolio._doc.amounts.find((entry) =>
			mongoose.Types.ObjectId(req.body.currency).equals(entry.currency)
		);
		if (portfolioAmount === undefined)
			throw new Error(
				"Not enough amount in this portfolio to perform this transaction with the given currency."
			);

		const amount = new BigNumber(portfolioAmount.amount);
		const amountAfter = amount.minus(req.body.amount);

		if (
			amountAfter.isNaN() ||
			!amountAfter.isFinite() ||
			amountAfter.isNegative()
		)
			throw new Error(
				"Not enough amount in this portfolio to perform this transaction with the given currency."
			);

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

			const amountToSubtract = mongoose.Types.Decimal128(
				new BigNumber(req.body.amount).negated().toString()
			);

			amountAfter.isZero()
				? await removeCurrencyEntryHelper(
						transaction._doc.portfolio,
						transaction._doc.user,
						transaction._doc.currency
				  )
				: await addInExistingCurrHelper(
						transaction._doc.portfolio,
						transaction._doc.user,
						amountToSubtract,
						transaction._doc.currency
				  );

			newPortfolio = await getPortfolioAmountsHelper(
				transaction._doc.user,
				transaction._doc.portfolio
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

async function createTransfer(req, res) {
	let session;
	try {
		await objectIdSchema.validateAsync(req.body.type);
		await validateTransactionTypeHelper(req.body.type, "transfer");
		await transferTransactionSchema.validateAsync(req.body, { convert: false });

		// Validating currency
		const currency = await CurrencySchema.findById(req.body.currency);
		if (currency === null) throw new Error("Invalid transaction currency");

		// Validating portfolio
		const portfolios = await getTransactionPortfoliosHelper(
			req.headers.userId,
			req.body.from,
			req.body.to
		);

		if (portfolios.length !== 2)
			throw new Error("Invalid transaction portfolios");

		const fromPortfolio = portfolios.find((portfolio) =>
			mongoose.Types.ObjectId(req.body.from).equals(portfolio._id)
		);

		const toPortfolio = portfolios.find((portfolio) =>
			mongoose.Types.ObjectId(req.body.to).equals(portfolio._id)
		);

		const toPortfolioAmount = toPortfolio.amounts.find((entry) =>
			mongoose.Types.ObjectId(req.body.currency).equals(entry.currency)
		);

		const fromPortfolioAmount = fromPortfolio.amounts.find((entry) =>
			mongoose.Types.ObjectId(req.body.currency).equals(entry.currency)
		);

		if (fromPortfolioAmount === undefined)
			throw new Error(
				"Not enough amount in this portfolio to perform this transaction with the given currency."
			);

		const amount = new BigNumber(fromPortfolioAmount.amount);
		const amountAfter = amount.minus(req.body.amount);

		if (
			amountAfter.isNaN() ||
			!amountAfter.isFinite() ||
			amountAfter.isNegative()
		)
			throw new Error(
				"Not enough amount in this portfolio to perform this transaction with the given currency."
			);

		session = await mongoose.startSession();

		let newTransaction, newToPortfolio, newFromPortfolio;

		await session.withTransaction(async () => {
			const createdAt = new Date();

			// Inserting Transaction
			const transaction = await TransactionSchema.create({
				createdAt,
				...req.body,
				date: createdAt,
				description: "Transfer",
				user: mongoose.Types.ObjectId(req.headers.userId),
			});

			const amountToSubtract = mongoose.Types.Decimal128(
				new BigNumber(transaction._doc.amount).negated().toString()
			);

			// Adding new entry to the to portfolio amounts or incrementing the current one
			toPortfolioAmount
				? await addInExistingCurrHelper(
						transaction._doc.to,
						transaction._doc.user,
						transaction._doc.amount,
						transaction._doc.currency
				  )
				: await createCurrencyEntryHelper(
						transaction._doc.to,
						transaction._doc.user,
						transaction._doc.amount,
						transaction._doc.currency
				  );
			// Decrement FROM portfolio
			amountAfter.isZero()
				? await removeCurrencyEntryHelper(
						transaction._doc.from,
						transaction._doc.user,
						transaction._doc.currency
				  )
				: await addInExistingCurrHelper(
						transaction._doc.from,
						transaction._doc.user,
						amountToSubtract,
						transaction._doc.currency
				  );

			newToPortfolio = await getPortfolioAmountsHelper(
				transaction._doc.user,
				transaction._doc.to
			);

			newFromPortfolio = await getPortfolioAmountsHelper(
				transaction._doc.user,
				transaction._doc.from
			);

			newTransaction = await getTransactionByIdHelper(
				transaction._doc._id,
				transaction._doc.user
			);
		});

		res.status(200).send({
			transaction: newTransaction,
			portfolios: [newFromPortfolio, newToPortfolio],
		});
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

async function deleteTransaction(req, res) {
	let session;
	try {
		await objectIdSchema.validateAsync(req.query.id);
		const transaction = await TransactionSchema.findOne({
			_id: mongoose.Types.ObjectId(req.query.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
			deletedAt: { $exists: 0 },
			correctedAt: { $exists: 0 },
			correctedBy: { $exists: 0 },
		});
		if (transaction === null) throw new Error("Transaction can not be found");

		// Check transaction type
		const transactionType = await TransactionTypesSchema.findById(
			transaction._doc.type
		);
		if (transactionType === null) throw new Error("Unknown transaction type");

		let result;

		switch (transactionType._doc.type) {
			case "earning":
				result = await deleteEarning(transaction._doc);
				break;
			case "expense":
				result = await deleteExpense(transaction._doc);
				break;
			case "transfer":
				result = await deleteTransfer(transaction._doc);
				break;
		}

		res.status(200).send(result);
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

async function deleteEarning(transaction) {
	const portfolio = await getActivePortfolioHelper(
		transaction.user,
		transaction.portfolio
	);
	if (portfolio === null) throw new Error("Invalid portfolio");

	const amount = portfolio._doc.amounts.find((entry) =>
		mongoose.Types.ObjectId(transaction.currency).equals(entry.currency)
	);

	if (amount === undefined)
		throw new Error(
			`Transaction could not be deleted. Not enough funds in the ${portfolio._doc.description} portfolio`
		);

	const portfolioAmount = new BigNumber(amount.amount);
	const transactionAmount = new BigNumber(transaction.amount);

	const amountToSubtract = mongoose.Types.Decimal128(
		transactionAmount.negated().toString()
	);
	const portfolioAmountAfter = portfolioAmount.minus(transactionAmount);

	if (
		portfolioAmountAfter.isNaN() ||
		!portfolioAmountAfter.isFinite() ||
		portfolioAmountAfter.isNegative()
	)
		throw new Error(
			`Transaction could not be deleted. Not enough funds in the ${portfolio._doc.description} portfolio`
		);

	// Deleting transaction
	await TransactionSchema.findByIdAndUpdate(transaction._id, {
		$set: {
			deletedAt: new Date(),
		},
	});

	// Decrementing earning portfolio
	portfolioAmountAfter.isZero()
		? await removeCurrencyEntryHelper(
				transaction.portfolio,
				transaction.user,
				transaction.currency
		  )
		: await addInExistingCurrHelper(
				transaction.portfolio,
				transaction.user,
				amountToSubtract,
				transaction.currency
		  );

	const portfolioAmounts = await getPortfolioAmountsHelper(
		transaction.user,
		transaction.portfolio
	);

	return {
		transaction: transaction._id,
		portfolio: portfolioAmounts,
	};
}

async function deleteExpense(transaction) {}

async function deleteTransfer(transaction) {}

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

export {
	createEarning,
	createExpense,
	createTransfer,
	deleteTransaction,
	getHomeStatistics,
};

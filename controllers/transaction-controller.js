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
	correctEarningTransactionSchema,
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
	getMultiplePortfoliosHelper,
} from "./portfolio-controller.js";
import { getActiveSourceHelper } from "./source-controller.js";
import { getActiveCategoryHelper } from "./category-controller.js";

// Schema
import CurrencySchema from "../schemas/currency-schema.js";
import TransactionSchema from "../schemas/transaction-schema.js";
import TransactionTypesSchema from "../schemas/transaction-types-schema.js";

// Big Number
import BigNumber from "bignumber.js";

const compareIds = (id1, id2) =>
	mongoose.Types.ObjectId(id1).equals(mongoose.Types.ObjectId(id2));

const getPortfolioAmountOfCurrency = (
	portfolio,
	currencyId,
	strict = false
) => {
	if (!portfolio) throw new Error("No portfolio to extract amount from.");
	const amount = portfolio.amounts.find((amount) =>
		compareIds(amount.currency, currencyId)
	);
	if (strict && amount === undefined)
		throw new Error(
			`Not enough amount in ${portfolio.description} portfolio to perform this transaction with the given currency.`
		);
	return amount;
};

const validateAmount = (description, amount, allowNegative = false) => {
	if (
		amount.isNaN() ||
		!amount.isFinite() ||
		(allowNegative === false && amount.isNegative())
	)
		throw new Error(
			`Not enough amount in ${description} portfolio to perform this transaction with the given currency.`
		);
};

async function validateTransactionTypeHelper(typeId, expectedType) {
	const type = await TransactionTypesSchema.findById(typeId);
	if (type === null || type._doc.type !== expectedType)
		throw new Error("Invalid transaction type");
}

async function validateSource(userId, sourceId) {
	const source = await getActiveSourceHelper(userId, sourceId);
	if (source === null) throw new Error("Invalid transaction source");
}

async function validateCategory(userId, categoryId) {
	const category = await getActiveCategoryHelper(userId, categoryId);
	if (category === null) throw new Error("Invalid transaction category");
}

async function validateCurrency(currencyId) {
	const currency = await CurrencySchema.findById(currencyId);
	if (currency === null) throw new Error("Invalid transaction currency");
	return currency;
}

async function validatePortfolio(userId, portfolioId) {
	const portfolio = await getActivePortfolioHelper(userId, portfolioId);
	if (portfolio === null) throw new Error("Invalid transaction portfolio");
	return portfolio;
}

async function validatePortfolios(userId, ...portfolioIds) {
	const portfolios = await getMultiplePortfoliosHelper(userId, ...portfolioIds);
	if (portfolios.length === 0 || portfolios.length !== portfolioIds.length)
		throw new Error("Transaction portfolios seem to be deleted");
	return portfolios;
}

async function getTransactionByIdHelper(transactionId, userId) {
	const transactions = await TransactionSchema.aggregate(
		getTransactionsAggregation(transactionId, userId)
	);
	return transactions[0];
}

async function createEarning(req, res) {
	const session = await mongoose.startSession();
	try {
		await objectIdSchema.validateAsync(req.body.type);
		await validateTransactionTypeHelper(req.body.type, "earning");
		req.body.date = new Date(req.body.date ?? "");
		await earningTransactionSchema.validateAsync(req.body, { convert: false });

		// Validating source
		await validateSource(req.headers.userId, req.body.source);

		// Validating currency
		await validateCurrency(req.body.currency);

		// Validating portfolio
		const portfolio = await validatePortfolio(
			req.headers.userId,
			req.body.portfolio
		);

		// Checking if the portfolio has an entry for this currency
		const hasExistingEntry = getPortfolioAmountOfCurrency(
			portfolio._doc,
			req.body.currency
		);

		let newTransaction, newPortfolio;

		await session.withTransaction(async () => {
			const createdAt = new Date();

			// Inserting Transaction
			const transaction = await TransactionSchema.create({
				createdAt,
				...req.body,
				user: mongoose.Types.ObjectId(req.headers.userId),
			});

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

async function correctEarning(req, res) {
	try {
		await objectIdSchema.validateAsync(req.body.id);

		req.body.date && (req.body.date = new Date(req.body.date));

		await correctEarningTransactionSchema.validateAsync(req.body, {
			convert: false,
		});

		// Getting old transaction (pre-edit)
		const transaction = await TransactionSchema.find({
			_id: mongoose.Types.ObjectId(req.body.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
			deletedAt: { $exists: 0 },
			correctedAt: { $exists: 0 },
			correctedBy: { $exists: 0 },
		});
		if (transaction === null)
			throw new Error(
				"Transaction you are trying to correct could not be found"
			);

		// Validating type
		await validateTransactionTypeHelper(transaction._doc.type, "earning");

		// Validating source if different from original
		if (compareIds(req.body.source, transaction._doc.source) === false)
			await validateSource(req.headers.userId, req.body.source);

		const diffCurrency = compareIds(
			req.body.currency,
			transaction._doc.currency
		);
		// Validating currency if different from original
		if (diffCurrency === false) await validateCurrency(req.body.currency);

		const newAmount = new BigNumber(req.body.amount);
		const oldAmount = new BigNumber(transaction._doc.amount);

		const portfolio = await validatePortfolio(
			req.headers.userId,
			transaction._doc.portfolio
		);
		// If not changing the currency
		if (diffCurrency === false) {
			const diffAmount = newAmount.minus(oldAmount);
			validateAmount(portfolio._doc.description, diffAmount, true);
			// If the correction will result in less funds in the portfolio
			if (diffAmount.isNegative()) {
				const portfolioAmount = getPortfolioAmountOfCurrency(
					portfolio._doc,
					req.body.currency,
					true
				);
				// If after the transfer the portfolio amount will go negative throw an error
				const amountAfter = diffAmount.plus(portfolioAmount);
				validateAmount(portfolio._doc.description, amountAfter, false);
			}
		}
		// If changing the currency
		else {
			// Get previous transaction currency amount
			const portfolioAmount = new BigNumber(
				getPortfolioAmountOfCurrency(
					portfolio._doc,
					transaction._doc.currency,
					true
				)
			);
			// Check if after removing the previous amount the portfolio amount goes negative
			const amountAfter = portfolioAmount.minus(oldAmount);
			validateAmount(portfolio._doc.description, amountAfter, false);
		}

		const session = await mongoose.startSession();

		let newTransactionId,
			correctedTransactionId = transaction._id;

		const { _id, oldTransactionData } = transaction;
		const { id, newTransactionData } = requestBody;

		const portfolioAmountInNewCurrency = getPortfolioAmountOfCurrency(
			portfolio._doc,
			requestBody.currency
		);

		session.withTransaction(async () => {
			const NOW = new Date();
			// Creating new Transaction
			const newTransaction = await TransactionSchema.create({
				...oldTransactionData,
				...newTransactionData,
				createdAt: NOW,
			});

			newTransactionId = newTransaction._doc._id;

			// Incrementing Portfolio (New Amount)
			portfolioAmountInNewCurrency
				? await addInExistingCurrHelper(
						newTransaction._doc.portfolio,
						newTransaction._doc.user,
						newTransaction._doc.amount,
						newTransaction._doc.currency
				  )
				: await createCurrencyEntryHelper(
						newTransaction._doc.portfolio,
						newTransaction._doc.user,
						newTransaction._doc.amount,
						newTransaction._doc.currency
				  );

			// Marking the previous transaction as corrected
			await TransactionSchema.findByIdAndUpdate(transaction._id, {
				$set: {
					correctedBy: newTransaction._doc._id,
					correctedAt: NOW,
				},
			});

			const oldPortfolio = await getActivePortfolioHelper(
				transaction.portfolio
			);

			const amount = getPortfolioAmountOfCurrency(
				oldPortfolio._doc,
				transaction.currency,
				true
			);

			const amountAfter = new BigNumber(amount).minus(transaction.amount);

			// Decrementing Portfolio (Previous Amount)
			amountAfter.isZero()
				? await removeCurrencyEntryHelper(
						transaction.portfolio,
						transaction.user,
						transaction.currency
				  )
				: await addInExistingCurrHelper(
						transaction.portfolio,
						transaction.user,
						mongoose.Types.Decimal128(
							new BigNumber(transaction.amount).negated().toString()
						),
						transaction.currency
				  );
		});

		const newTransaction = await getTransactionByIdHelper(
			newTransactionId,
			transaction.user
		);

		const updatedPortfolios = [];

		const arrayOfChangedPortfolios = Array.from(
			new Set([transaction.portfolio.toString(), req.body.portfolio])
		);

		for (let entry of arrayOfChangedPortfolios) {
			const updatedPortfolio = await getPortfolioAmountsHelper(
				req.headers.userId,
				entry.portfolio
			);
			updatedPortfolios.push(updatedPortfolio);
		}

		res.status(200).send({
			correctedId: correctedTransactionId,
			transaction: newTransaction,
			portfolios: [updatedPortfolios],
		});
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

async function createExpense(req, res) {
	const session = await mongoose.startSession();
	try {
		await objectIdSchema.validateAsync(req.body.type);
		await validateTransactionTypeHelper(req.body.type, "expense");
		req.body.date = new Date(req.body.date ?? "");
		await expenseTransactionSchema.validateAsync(req.body, { convert: false });

		// Validating category
		await validateCategory(req.headers.userId, req.body.category);

		// Validating currency
		await validateCurrency(req.body.currency);

		// Validating portfolio
		const portfolio = await validatePortfolio(
			req.headers.userId,
			req.body.portfolio
		);

		const portfolioAmount = await getPortfolioAmountOfCurrency(
			portfolio._doc,
			req.body.currency,
			true
		);

		const amount = new BigNumber(portfolioAmount.amount);
		const amountAfter = amount.minus(req.body.amount);

		validateAmount(portfolio._doc.description, amountAfter);

		const amountToSubtract = mongoose.Types.Decimal128(
			new BigNumber(req.body.amount).negated().toString()
		);

		let newTransaction, newPortfolio;

		await session.withTransaction(async () => {
			const createdAt = new Date();

			// Inserting Transaction
			const transaction = await TransactionSchema.create({
				createdAt,
				...req.body,
				user: mongoose.Types.ObjectId(req.headers.userId),
			});

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
	const session = await mongoose.startSession();
	try {
		await objectIdSchema.validateAsync(req.body.type);
		await validateTransactionTypeHelper(req.body.type, "transfer");
		await transferTransactionSchema.validateAsync(req.body, { convert: false });

		// Validating currency
		await validateCurrency(req.body.currency);

		// Validating portfolio
		const portfolios = await validatePortfolios(
			req.headers.userId,
			req.body.from,
			req.body.to
		);

		const toPortfolioAmount = getPortfolioAmountOfCurrency(
			portfolios.find((portfolio) => compareIds(req.body.to, portfolio._id)),
			req.body.currency
		);

		const fromPortfolioAmount = getPortfolioAmountOfCurrency(
			portfolios.find((portfolio) => compareIds(req.body.from, portfolio._id)),
			req.body.currency,
			true
		);

		const amount = new BigNumber(fromPortfolioAmount.amount);
		const amountAfter = amount.minus(req.body.amount);

		validateAmount(fromPortfolioAmount._doc.description, amountAfter);

		const amountToSubtract = mongoose.Types.Decimal128(
			new BigNumber(req.body.amount).negated().toString()
		);

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

		session = await mongoose.startSession();

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
	}
}

async function deleteEarning(transaction) {
	const portfolio = await validatePortfolio(
		transaction.user,
		transaction.portfolio
	);
	const amount = getPortfolioAmountOfCurrency(
		portfolio._doc,
		transaction.currency,
		true
	);

	const portfolioAmount = new BigNumber(amount.amount);
	const transactionAmount = new BigNumber(transaction.amount);

	const amountToSubtract = mongoose.Types.Decimal128(
		transactionAmount.negated().toString()
	);
	const portfolioAmountAfter = portfolioAmount.minus(transactionAmount);

	validateAmount(portfolio._doc.description, portfolioAmountAfter);

	const session = await mongoose.startSession();

	session.withTransaction(async () => {
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
	});

	session && session.endSession();

	const portfolioAmounts = await getPortfolioAmountsHelper(
		transaction.user,
		transaction.portfolio
	);

	return {
		transaction: transaction._id,
		portfolio: portfolioAmounts,
	};
}

async function deleteExpense(transaction) {
	const portfolio = await validatePortfolio(
		transaction.user,
		transaction.portfolio
	);

	// Checking if the portfolio has an entry for this currency
	const hasExistingEntry = getPortfolioAmountOfCurrency(
		portfolio._doc,
		transaction.currency
	);

	const session = await mongoose.startSession();

	session.withTransaction(async () => {
		// Deleting transaction
		await TransactionSchema.findByIdAndUpdate(transaction._id, {
			$set: {
				deletedAt: new Date(),
			},
		});
		// Adding new entry to portfolio amounts or incrementing the current one
		hasExistingEntry
			? await addInExistingCurrHelper(
					transaction.portfolio,
					transaction.user,
					transaction.amount,
					transaction.currency
			  )
			: await createCurrencyEntryHelper(
					transaction.portfolio,
					transaction.user,
					transaction.amount,
					transaction.currency
			  );
	});

	const portfolioAmounts = await getPortfolioAmountsHelper(
		transaction.user,
		transaction.portfolio
	);

	return {
		transaction: transaction._id,
		portfolio: portfolioAmounts,
	};
}

async function deleteTransfer(transaction) {
	const portfolios = await validatePortfolios(
		transaction.user,
		transaction.from,
		transaction.to
	);

	const toPortfolioAmount = getPortfolioAmountOfCurrency(
		portfolios.find((portfolio) => compareIds(transaction.to, portfolio._id)),
		transaction.currency,
		true
	);

	const fromPortfolioAmount = getPortfolioAmountOfCurrency(
		portfolios.find((portfolio) => compareIds(transaction.from, portfolio._id)),
		transaction.currency
	);

	const amount = new BigNumber(toPortfolioAmount.amount);
	const transactionAmount = new BigNumber(transaction.amount);
	const amountAfter = amount.minus(transactionAmount);

	const amountToSubtract = mongoose.Types.Decimal128(
		transactionAmount.negated().toString()
	);

	validateAmount(toPortfolioAmount.description, amountAfter);

	const session = await mongoose.startSession();

	session.withTransaction(async () => {
		// Deleting transaction
		await TransactionSchema.findByIdAndUpdate(transaction._id, {
			$set: {
				deletedAt: new Date(),
			},
		});
		// Incrementing FROM portfolio
		fromPortfolioAmount
			? await addInExistingCurrHelper(
					transaction.from,
					transaction.user,
					transaction.amount,
					transaction.currency
			  )
			: await createCurrencyEntryHelper(
					transaction.from,
					transaction.user,
					transaction.amount,
					transaction.currency
			  );
		// Decrement TO portfolio
		amountAfter.isZero()
			? await removeCurrencyEntryHelper(
					transaction.to,
					transaction.user,
					transaction.currency
			  )
			: await addInExistingCurrHelper(
					transaction.to,
					transaction.user,
					amountToSubtract,
					transaction.currency
			  );
	});

	const newToPortfolio = await getPortfolioAmountsHelper(
		transaction.user,
		transaction.to
	);

	const newFromPortfolio = await getPortfolioAmountsHelper(
		transaction.user,
		transaction.from
	);

	return {
		transaction: transaction._id,
		portfolio: [newToPortfolio, newFromPortfolio],
	};
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

export {
	correctEarning,
	createEarning,
	createExpense,
	createTransfer,
	deleteTransaction,
	getHomeStatistics,
};

// Mongoose
import mongoose from "mongoose";

// Validation
import {
	homeStatisticsSchema,
	earningTransactionSchema,
	expenseTransactionSchema,
	transferTransactionSchema,
	correctEarningTransactionSchema,
	correctExpenseTransactionSchema,
} from "../validators/transaction-validators.js";
import { objectIdSchema } from "../validators/general-validators.js";

// Aggregations
import {
	getTransactionsAggregation,
	homeStatisticsAggregation,
} from "../aggregations/transaction-aggregations.js";

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
	let session;
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

		session = await mongoose.startSession();

		let newPortfolio, newTransaction;

		const createdAt = new Date();

		await session.withTransaction(async () => {
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

		await session.commitTransaction();

		res
			.status(200)
			.send({ transaction: newTransaction, portfolio: newPortfolio[0] });
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	} finally {
		if (session) await session.endSession();
	}
}

async function correctEarning(req, res) {
	let session;
	try {
		await objectIdSchema.validateAsync(req.body.id);

		req.body.date && (req.body.date = new Date(req.body.date));

		await correctEarningTransactionSchema.validateAsync(req.body, {
			convert: false,
		});

		// Getting old transaction (pre-edit)
		const transactionToCorrect = await TransactionSchema.findOne({
			_id: mongoose.Types.ObjectId(req.body.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
			deletedAt: { $exists: 0 },
			correctedAt: { $exists: 0 },
			correctedBy: { $exists: 0 },
		});
		if (transactionToCorrect === null)
			throw new Error(
				"Transaction you are trying to correct could not be found"
			);

		// New Transaction Amount
		const NTA = new BigNumber(req.body.amount);
		// Old Transaction Amount
		const OTA = new BigNumber(transactionToCorrect._doc.amount);

		// Getting Portfolios (Old and new)
		const portfoliosArray = Array.from(
			new Set([
				transactionToCorrect._doc.portfolio.toString(),
				req.body.portfolio,
			])
		);

		const samePortfolio = compareIds(
			req.body.portfolio,
			transactionToCorrect._doc.portfolio
		);

		// Validating portfolio
		const affectedPortfolios = await validatePortfolios(
			req.headers.userId,
			...portfoliosArray
		);

		// Getting old portfolio data
		const oldPortfolio = affectedPortfolios.find((portfolio) =>
			compareIds(portfolio._id, transactionToCorrect._doc.portfolio)
		);

		// Old Portfolio Amount In Old Currency
		const OPAIOC = new BigNumber(
			getPortfolioAmountOfCurrency(
				oldPortfolio,
				transactionToCorrect._doc.currency
			)?.amount ?? 0
		);

		// Getting new portfolio data
		const newPortfolio = affectedPortfolios.find((portfolio) =>
			compareIds(portfolio._id, req.body.portfolio)
		);
		// New Portfolio Amount In New Currency
		const NPAINC = getPortfolioAmountOfCurrency(
			newPortfolio,
			req.body.currency
		);

		// Validating Type
		await validateTransactionTypeHelper(
			transactionToCorrect._doc.type,
			"earning"
		);

		// Validating Source (if different from original)
		const sameSource = compareIds(
			req.body.source,
			transactionToCorrect._doc.source
		);
		if (sameSource === false)
			await validateSource(req.headers.userId, req.body.source);

		// Validating Currency (if different from original)
		const sameCurrency = compareIds(
			req.body.currency,
			transactionToCorrect._doc.currency
		);
		if (sameCurrency === false) await validateCurrency(req.body.currency);

		// Calculating the remaining amount in the old portfolio.
		const amountAfter =
			sameCurrency && samePortfolio
				? OPAIOC.plus(NTA).minus(OTA)
				: OPAIOC.minus(OTA);

		// Do not allow correction if the portfolio amount will go negative
		validateAmount(oldPortfolio._doc.description, amountAfter, false);

		const amountToSubtract = mongoose.Types.Decimal128(
			new BigNumber(transactionToCorrect._doc.amount).negated().toString()
		);

		const NOW = new Date();

		const { _id, ...transactionToCorrectData } = transactionToCorrect._doc;
		const { id, ...newTransactionData } = req.body;

		session = await mongoose.startSession();

		let populatedNewTransaction, populatedAffectedPortfolios;

		await session.withTransaction(async () => {
			// Adding New Transaction
			const newTransaction = await TransactionSchema.create({
				...transactionToCorrectData,
				...newTransactionData,
				createdAt: NOW,
			});

			// Incrementing New Portfolio Amount
			NPAINC
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

			// Correcting previous transaction
			await TransactionSchema.findByIdAndUpdate(transactionToCorrect._doc._id, {
				$set: {
					correctedBy: newTransaction._doc._id,
					correctedAt: NOW,
				},
			});

			// Decrementing Old Portfolio Amount
			amountAfter.isZero()
				? await removeCurrencyEntryHelper(
						transactionToCorrect._doc.portfolio,
						transactionToCorrect._doc.user,
						transactionToCorrect._doc.currency
				  )
				: await addInExistingCurrHelper(
						transactionToCorrect._doc.portfolio,
						transactionToCorrect._doc.user,
						amountToSubtract,
						transactionToCorrect._doc.currency
				  );

			// Fetching updated data to send back to client
			populatedNewTransaction = await getTransactionByIdHelper(
				newTransaction._doc._id,
				newTransaction._doc.user
			);
			populatedAffectedPortfolios = await getPortfolioAmountsHelper(
				req.headers.userId,
				...portfoliosArray
			);
		});

		await session.commitTransaction();

		res.status(200).send({
			correctedId: transactionToCorrect._doc._id,
			transaction: populatedNewTransaction,
			portfolios: populatedAffectedPortfolios,
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
		if (session) await session.endSession();
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

		session = await mongoose.startSession();

		const createdAt = new Date();

		await session.withTransaction(async () => {
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

		await session.commitTransaction();

		res
			.status(200)
			.send({ transaction: newTransaction, portfolio: newPortfolio[0] });
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	} finally {
		if (session) await session.endSession();
	}
}

async function correctExpense(req, res) {
	let session;
	try {
		await objectIdSchema.validateAsync(req.body.id);

		req.body.date && (req.body.date = new Date(req.body.date));

		await correctExpenseTransactionSchema.validateAsync(req.body, {
			convert: false,
		});

		// Getting old transaction (pre-edit)
		const transactionToCorrect = await TransactionSchema.findOne({
			_id: mongoose.Types.ObjectId(req.body.id),
			user: mongoose.Types.ObjectId(req.headers.userId),
			deletedAt: { $exists: 0 },
			correctedAt: { $exists: 0 },
			correctedBy: { $exists: 0 },
		});
		if (transactionToCorrect === null)
			throw new Error(
				"Transaction you are trying to correct could not be found"
			);

		// New Transaction Amount
		const NTA = new BigNumber(req.body.amount);
		// Old Transaction Amount
		const OTA = new BigNumber(transactionToCorrect._doc.amount);

		// Getting Portfolios (Old and new)
		const portfoliosArray = Array.from(
			new Set([
				transactionToCorrect._doc.portfolio.toString(),
				req.body.portfolio,
			])
		);

		const samePortfolio = compareIds(
			req.body.portfolio,
			transactionToCorrect._doc.portfolio
		);

		// Validating portfolio
		const affectedPortfolios = await validatePortfolios(
			req.headers.userId,
			...portfoliosArray
		);

		// Getting old portfolio data
		const oldPortfolio = affectedPortfolios.find((portfolio) =>
			compareIds(portfolio._id, transactionToCorrect._doc.portfolio)
		);

		// Old Portfolio Amount In Old Currency
		const OPAIOC = new BigNumber(
			getPortfolioAmountOfCurrency(
				oldPortfolio,
				transactionToCorrect._doc.currency
			)?.amount ?? 0
		);

		// Getting new portfolio data
		const newPortfolio = affectedPortfolios.find((portfolio) =>
			compareIds(portfolio._id, req.body.portfolio)
		);
		// New Portfolio Amount In New Currency
		const NPAINC = getPortfolioAmountOfCurrency(
			newPortfolio,
			req.body.currency
		);

		// Validating Type
		await validateTransactionTypeHelper(
			transactionToCorrect._doc.type,
			"earning"
		);

		// Validating Category (if different from original)
		const sameCategory = compareIds(
			req.body.category,
			transactionToCorrect._doc.category
		);
		if (sameCategory === false)
			await validateSource(req.headers.userId, req.body.source);

		// Validating Currency (if different from original)
		const sameCurrency = compareIds(
			req.body.currency,
			transactionToCorrect._doc.currency
		);
		if (sameCurrency === false) await validateCurrency(req.body.currency);

		// Calculating the remaining amount in the new portfolio.
		const amountAfter =
			sameCurrency && samePortfolio
				? NPAINC.plus(OTA).minus(NTA)
				: NPAINC.minus(NTA);

		// Do not allow correction if the portfolio amount will go negative
		validateAmount(oldPortfolio._doc.description, amountAfter, false);

		const NOW = new Date();

		const amountToSubtract = mongoose.Types.Decimal128(
			new BigNumber(req.body.amount).negated().toString()
		);

		const { _id, ...transactionToCorrectData } = transactionToCorrect._doc;
		const { id, ...newTransactionData } = req.body;

		session = await mongoose.startSession();

		let populatedNewTransaction, populatedAffectedPortfolios;

		await session.withTransaction(async () => {
			// Adding New Transaction
			const newTransaction = await TransactionSchema.create({
				...transactionToCorrectData,
				...newTransactionData,
				createdAt: NOW,
			});

			// Decrementing Old Portfolio Amount
			amountAfter.isZero()
				? await removeCurrencyEntryHelper(
						newTransaction._doc.portfolio,
						newTransaction._doc.user,
						newTransaction._doc.currency
				  )
				: await addInExistingCurrHelper(
						newTransaction._doc.portfolio,
						newTransaction._doc.user,
						amountToSubtract,
						newTransaction._doc.currency
				  );

			// Correcting previous transaction
			await TransactionSchema.findByIdAndUpdate(transactionToCorrect._doc._id, {
				$set: {
					correctedBy: newTransaction._doc._id,
					correctedAt: NOW,
				},
			});

			// Refund the previous transactions cost
			OPAIOC
				? await addInExistingCurrHelper(
						transactionToCorrect._doc.portfolio,
						transactionToCorrect._doc.user,
						transactionToCorrect._doc.amount,
						transactionToCorrect._doc.currency
				  )
				: await createCurrencyEntryHelper(
						transactionToCorrect._doc.portfolio,
						transactionToCorrect._doc.user,
						transactionToCorrect._doc.amount,
						transactionToCorrect._doc.currency
				  );

			// Fetching updated data to send back to client
			populatedNewTransaction = await getTransactionByIdHelper(
				newTransaction._doc._id,
				newTransaction._doc.user
			);
			populatedAffectedPortfolios = await getPortfolioAmountsHelper(
				req.headers.userId,
				...portfoliosArray
			);
		});

		await session.commitTransaction();

		res.status(200).send({
			correctedId: transactionToCorrect._doc._id,
			transaction: populatedNewTransaction,
			portfolios: populatedAffectedPortfolios,
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
		if (session) await session.endSession();
	}
}

async function createTransfer(req, res) {
	let session;
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

		session = await mongoose.startSession();

		let newTransaction, affectedPortfolios;
		const createdAt = new Date();

		await session.withTransaction(async () => {
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

			affectedPortfolios = await getPortfolioAmountsHelper(
				transaction._doc.user,
				transaction._doc.to,
				transaction._doc.from
			);

			newTransaction = await getTransactionByIdHelper(
				transaction._doc._id,
				transaction._doc.user
			);
		});

		await session.commitTransaction();

		res.status(200).send({
			transaction: newTransaction,
			portfolios: affectedPortfolios,
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
		if (session) await session.endSession();
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
	let session;
	try {
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

		session = await mongoose.startSession();

		let portfolioAmounts;

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

			portfolioAmounts = await getPortfolioAmountsHelper(
				transaction.user,
				transaction.portfolio
			);
		});

		await session.commitTransaction();

		return {
			transaction: transaction._id,
			portfolio: portfolioAmounts[0],
		};
	} catch (err) {
		console.err(err);
		throw new Error(err);
	} finally {
		if (session) await session.endSession();
	}
}

async function deleteExpense(transaction) {
	let session;
	try {
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

		let portfolioAmounts;

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

			portfolioAmounts = await getPortfolioAmountsHelper(
				transaction.user,
				transaction.portfolio
			);
		});

		await session.commitTransaction();

		return {
			transaction: transaction._id,
			portfolio: portfolioAmounts[0],
		};
	} catch (err) {
		console.error(err);
		throw new Error(err);
	} finally {
		if (session) await session.endSession();
	}
}

async function deleteTransfer(transaction) {
	let session;
	try {
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
			portfolios.find((portfolio) =>
				compareIds(transaction.from, portfolio._id)
			),
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

		let affectedPortfolios;

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

			affectedPortfolios = await getPortfolioAmountsHelper(
				transaction.user,
				transaction.to,
				transaction.from
			);
		});

		await session.commitTransaction();

		return {
			transaction: transaction._id,
			portfolio: affectedPortfolios,
		};
	} catch (err) {
		console.error(err);
		throw new Error(err);
	} finally {
		if (session) await session.endSession();
	}
}

async function getHomeStatistics(req, res) {
	try {
		await homeStatisticsSchema.validateAsync(req.query);

		const end = new Date(req.query.end);
		const start = new Date(req.query.start);

		// EOD = End of day
		const EODTimestamp = new Date(req.query.end).setUTCDate(
			end.getUTCDate() - 1
		);
		// SOD = Start of day
		const SODTimestamp = new Date(req.query.start).setUTCDate(
			start.getUTCDate() - 1
		);

		const prevEnd = new Date(EODTimestamp);
		const prevStart = new Date(SODTimestamp);

		const getBoundaries = (start) => {
			let arr = [];
			for (let i = 6; i >= -1; i--) {
				let timestamp = new Date(start).setUTCDate(start.getUTCDate() - i);
				arr.push(new Date(timestamp));
			}
			return arr;
		};

		const boundaries = getBoundaries(start);

		const transactionTypes = await TransactionTypesSchema.find({});

		const expenseTypeId = transactionTypes.find(
			(el) => el.type === "expense"
		)._id;

		let data = await TransactionSchema.aggregate(
			homeStatisticsAggregation({
				end,
				start,
				prevEnd,
				prevStart,
				boundaries,
				expenseTypeId,
				userId: req.headers.userId,
			})
		);

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
				let previousVal = new BigNumber(previous[element.type]["amount"]);
				let todayVal = new BigNumber(today[element.type]["amount"]);
				today[element.type]["percent"] = previousVal.isZero()
					? 0
					: todayVal
							.minus(previousVal)
							.dividedBy(previousVal)
							.times(100)
							.decimalPlaces(2)
							.toNumber();
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
	correctEarning,
	createExpense,
	correctExpense,
	createTransfer,
	deleteTransaction,
	getHomeStatistics,
};

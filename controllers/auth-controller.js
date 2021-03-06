import mongoose from "mongoose";

// BCrypt
import bcrypt from "bcrypt";

// Validation
import {
	loginSchema,
	signUpSchema,
	usernameSchema,
} from "../validators/auth-validators.js";

// Schema
import UserSchema from "../schemas/user-schema.js";
import CurrencySchema from "../schemas/currency-schema.js";

// Utilities
import {
	generateToken,
	verifyRefreshToken,
	generateRefreshToken,
} from "../utilities/token-utilities.js";

// Aggregations
import { getUserAggregation } from "../aggregations/user-aggregations.js";

// Helpers
import { getBanksHelper } from "./bank-controller.js";
import { getSourcesHelper } from "./source-controller.js";
import { getCategoriesHelper } from "./category-controller.js";
import { getCurrenciesHelper } from "./currency-controller.js";
import { getPortfoliosHelper } from "./portfolio-controller.js";
import { getPortfolioTypesHelper } from "./portfolio-types-controller.js";
import { getTransactionTypesHelper } from "./transaction-types-controller.js";

const hashPassword = async (password) => await bcrypt.hash(password, 10);

async function fetchNecessaryUserData(userId) {
	const banks = getBanksHelper();
	const sources = getSourcesHelper(userId);
	const currencies = getCurrenciesHelper(userId);
	const categories = getCategoriesHelper(userId);
	const portfolios = getPortfoliosHelper(userId);
	const portfolioTypes = getPortfolioTypesHelper();
	const transactionTypes = getTransactionTypesHelper();
	const user = UserSchema.aggregate(getUserAggregation(userId));
	try {
		const result = await Promise.all([
			user,
			banks,
			currencies,
			sources,
			portfolioTypes,
			categories,
			portfolios,
			transactionTypes,
		]);
		return {
			user: result[0][0],
			banks: result[1],
			currencies: result[2],
			sources: result[3],
			portfolioTypes: result[4],
			categories: result[5],
			portfolios: result[6],
			transactionTypes: result[7],
		};
	} catch (err) {
		console.error(err);
		throw new Error("Initial fetch error");
	}
}

async function signUp(req, res) {
	try {
		await signUpSchema.validateAsync(req.body);

		const count = await UserSchema.count({
			username: req.body.username,
		});

		if (count !== 0) throw new Error("Username is taken ????");

		req.body.password = await hashPassword(req.body.password);

		const currency = await CurrencySchema.findOne({
			acronym: "ALL",
		});

		if (currency === null)
			throw new Error("Internal error: Could not set default currency");

		const user = await UserSchema.create({
			...req.body,
			lastLogIn: new Date(),
			defaultCurrency: currency._doc._id,
		});

		// Tokens
		const token = await generateToken({ userId: user._doc._id });
		const refresh = await generateRefreshToken({ userId: user._doc._id });

		await UserSchema.findByIdAndUpdate(user._doc._id, {
			$set: {
				refresh: refresh,
			},
		});

		const necessaryData = await fetchNecessaryUserData(user._doc._id);

		res.cookie("refresh", refresh, {
			httpOnly: true,
			// 1 day
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(200).send({ token, ...necessaryData });
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

async function validateUsername(req, res) {
	try {
		await usernameSchema.validateAsync(req.query.username);
		const count = await UserSchema.count({
			username: req.query.username,
		});
		if (count !== 0) throw new Error("Username is taken ????");
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

async function logIn(req, res) {
	try {
		await loginSchema.validateAsync(req.body);

		const user = await UserSchema.findOne({
			username: req.body.username,
		});

		if (user === null) throw new Error("Invalid username or password");

		const isPwdCorrect = await bcrypt.compare(
			req.body.password,
			user._doc.password
		);

		if (isPwdCorrect === false) throw new Error("Invalid username or password");

		// Tokens
		const token = await generateToken({ userId: user._doc._id });
		const refresh = await generateRefreshToken({ userId: user._doc._id });

		const updateObject = {
			$set: {
				refresh: refresh,
				lastLogIn: new Date(),
			},
		};

		// Revert the delete flag
		if (user.deletedAt !== undefined) {
			updateObject["$unset"] = {
				deletedAt: "",
			};
		}

		await UserSchema.findByIdAndUpdate(user._doc._id, updateObject);

		const necessaryData = await fetchNecessaryUserData(user._doc._id);

		res.cookie("refresh", refresh, {
			httpOnly: true,
			// 1 day
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(200).send({
			token,
			...necessaryData,
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

async function logOut(req, res) {
	try {
		await UserSchema.findByIdAndUpdate(req.headers.userId, {
			$set: {
				lastLogOut: new Date(),
			},
			$unset: {
				refresh: "",
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

async function refreshToken(req, res) {
	try {
		// Verifying if refresh token is valid
		const decodedToken = await verifyRefreshToken(req.cookies.refresh);

		// Verifying if it is the same as the one stored in DB
		const user = await UserSchema.findOne({
			user: mongoose.Types.ObjectId(decodedToken.payload.userId),
			deletedAt: { $exists: 0 },
		});

		if (user === null || user?.refresh !== req.cookies.refresh)
			throw new Error("Invalid token");

		// Generating a new token
		const newToken = await generateToken(decodedToken.payload);

		res.status(200).send({ token: newToken });
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
	logIn,
	signUp,
	logOut,
	refreshToken,
	hashPassword,
	validateUsername,
	fetchNecessaryUserData,
};

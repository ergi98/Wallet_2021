// BCrypt
import bcrypt from "bcrypt";

// Validation
import {
	loginSchema,
	usernameSchema,
	signUpSchema,
} from "../validators/auth-validators.js";

// Schema
import UserSchema from "../schemas/user-schema.js";
import CurrencySchema from "../schemas/currency.schema.js";

// Utilities
import {
	generateRefreshToken,
	generateToken,
} from "../utilities/token-utilities.js";

const hashPassword = async (password) => await bcrypt.hash(password, 10);

async function signUp(req, res) {
	try {
		let userData = req.body;
		await signUpSchema.validateAsync(userData);

		let count = await UserSchema.count({
			username: userData.username,
		});

		if (count > 0) throw new Error("Username is taken 😔");

		userData.password = await hashPassword(userData.password);
		userData.lastLogIn = new Date().toISOString();

		let newUser = await UserSchema.create(userData);

		// User Info
		let userFields = getUserFields(newUser);

		// Tokens
		let token = await generateToken({ userId: userFields._id });
		let refresh = await generateRefreshToken({ userId: userFields._id });

		await UserSchema.findByIdAndUpdate(newUser._doc._id, {
			$set: {
				refresh: refresh,
			},
		});

		res.status(200).send({ user: userFields, token, refresh });
	} catch (err) {
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
			err: err,
		});
	}
}

async function validateUsername(req, res) {
	try {
		await usernameSchema.validateAsync(req.query.username);
		let count = await UserSchema.count({
			username: req.query.username,
		});
		if (count > 0) throw new Error("Username is taken 😔");
		res.status(200).send();
	} catch (err) {
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
			err: err,
		});
	}
}

async function logIn(req, res) {
	try {
		await loginSchema.validateAsync(req.body);

		const user = await UserSchema.findOne({
			username: req.body.username,
		});

		let isPwdCorrect = user
			? await bcrypt.compare(req.body.password, user._doc.password)
			: false;

		if (user === null || isPwdCorrect === false)
			throw new Error("Invalid username or password");
		// Revert the delete flag
		else if (user.deletedAt !== null) {
			await UserSchema.findByIdAndUpdate(user._doc._id, {
				$unset: {
					deletedAt: "",
				},
			});
		}

		await user.populate("defaultCurrency");

		// User Info
		let userFields = getUserFields(user);

		// Tokens
		let token = await generateToken({ userId: userFields._id });
		let refresh = await generateRefreshToken({ userId: userFields._id });

		await UserSchema.findByIdAndUpdate(user._doc._id, {
			$set: {
				lastLogIn: new Date(),
				refresh: refresh,
			},
		});

		res.status(200).send({ user: userFields, token, refresh });
	} catch (err) {
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
			err: err,
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
		res.status(400).send(err);
	}
}

function getUserFields(userDoc) {
	let user = userDoc._doc;
	let {
		updatedAt,
		lastLogOut,
		lastLogIn,
		deletedAt,
		createdAt,
		password,
		refresh,
		...userData
	} = user;
	return userData;
}

export { logIn, signUp, logOut, validateUsername };

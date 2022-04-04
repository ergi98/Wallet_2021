// BCrypt
import bcrypt from "bcrypt";

// Validation
import { loginSchema } from "../validators/auth-validators.js";

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
	} catch (err) {}
}

async function validateUsername(req, res) {
	try {
	} catch (err) {}
}

async function logIn(req, res) {
	try {
		await loginSchema.validateAsync(req.body);

		const user = await UserSchema.findOne({
			username: req.body.username,
		});

		let isPwdCorrect = await bcrypt.compare(
			req.body.password,
			user._doc.password
		);

		if (user === null || isPwdCorrect === false)
			throw new Error("Invalid username or password");
		// Revert the delete flag
		else if (user.deletedAt !== null) {
			await UserSchema.findByIdAndUpdate(user._doc._id, {
				$set: {
					deletedAt: null,
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
				refresh: null,
				lastLogOut: new Date(),
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
	if (Array.isArray(userData.defaultCurrency)) {
		userData.defaultCurrency = userData.defaultCurrency[0];
	}
	return userData;
}

export { logIn, signUp, logOut, validateUsername };

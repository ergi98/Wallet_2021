// BCrypt
import bcrypt from "bcrypt";

// JWT
import jwt from "jsonwebtoken";

// Validation
import { loginSchema } from "../validators/auth-validators.js";

// Schema
import UserSchema from "../schemas/user-schema.js";
import CurrencySchema from "../schemas/currency.schema.js";

const hashPassword = async (password) => await bcrypt.hash(password, 10);

console.log(await hashPassword("DevPassword1"));

async function signUp(req, res) {
	try {
	} catch (err) {}
}

async function validateUsername() {
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

		// Return token and user
		let userFields = getUserFields(user);
		let token = generateToken(userFields);
		res.status(200).send({ user: userFields, token });
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
	} catch (err) {}
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
		...userData
	} = user;
	if (Array.isArray(userData.defaultCurrency)) {
		userData.defaultCurrency = userData.defaultCurrency[0];
	}
	return userData;
}
function generateToken(userFields) {
	return jwt.sign(
		{
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
			userFields,
		},
		process.env.SECRET_KEY
	);
}

export { logIn, signUp, logOut, validateUsername };

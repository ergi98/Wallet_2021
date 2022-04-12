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

// Utilities
import {
	generateToken,
	verifyRefreshToken,
	generateRefreshToken,
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

		const user = await UserSchema.create(userData);

		// Tokens
		let token = await generateToken({ userId: user._doc._id });
		let refresh = await generateRefreshToken({ userId: user._doc._id });

		await UserSchema.findByIdAndUpdate(user._doc._id, {
			$set: {
				refresh: refresh,
			},
		});

		res.status(200).send({ token, refresh });
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
		if (count !== 0) throw new Error("Username is taken 😔");
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

		if (user === null) throw new Error("Invalid username or password");

		let isPwdCorrect = await bcrypt.compare(
			req.body.password,
			user._doc.password
		);

		if (isPwdCorrect === false) throw new Error("Invalid username or password");

		// Revert the delete flag
		if (user.deletedAt !== undefined) {
			await UserSchema.findByIdAndUpdate(user._doc._id, {
				$unset: {
					deletedAt: "",
				},
			});
		}

		// Tokens
		let token = await generateToken({ userId: user._doc._id });
		let refresh = await generateRefreshToken({ userId: user._doc._id });

		await UserSchema.findByIdAndUpdate(user._doc._id, {
			$set: {
				lastLogIn: new Date(),
				refresh: refresh,
			},
		});

		res.cookie("refresh", refresh, {
			httpOnly: true,
			// 1 day
			maxAge: 24 * 60 * 60 * 1000,
		});
    
		res.status(200).send({ token });
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

async function refreshToken(req, res) {
	try {
		// Verifying if refresh token is valid
		const decodedToken = await verifyRefreshToken(req.cookies.refresh);
		// Verifying if it is the same as the one stored in DB
		const user = await UserSchema.findById(decodedToken.payload.userId);
		if (user === null || user?.refresh !== req.cookies.refresh)
			throw new Error("Invalid token");

		console.log(user);
		// Generating a new token
		const newToken = await generateToken(decodedToken.payload);
		res.status(200).send({ token: newToken });
	} catch (err) {
		res.status(400).send(err);
	}
}

export { logIn, signUp, logOut, refreshToken, validateUsername };

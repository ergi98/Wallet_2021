import {
	verifyToken,
	generateToken,
	verifyRefreshToken,
} from "../utilities/token-utilities.js";

import UserSchema from "../schemas/user-schema.js";

export default async function tokenMiddleware(req, res, next) {
	try {
		let decodedToken = await verifyToken(req.headers.authorization);
		req.headers.userId = decodedToken.payload.userId;
		next();
	} catch (err) {
    console.log(err)
		err.name === "TokenExpiredError"
			? await reIssueToken(req, res, next)
			: res.status(500).send({ message: "Invalid Token", err });
	}
}

async function reIssueToken(req, res, next) {
	try {
		// Verifying if refresh token is valid
		let decodedToken = await verifyRefreshToken(req.headers.refresh);
		// Verifying if it is the same as the one stored in DB
		let user = await UserSchema.findById(decodedToken.payload.userId);
		if (user === null || user?.refresh !== req.headers.refresh)
			throw new Error("Invalid token");
		// Generating a new token
		let newToken = await generateToken(decodedToken.payload);
		res.setHeader("token", newToken);
		// Populating userId
		req.headers.userId = decodedToken.payload.userId;
		next();
	} catch (err) {
		res.status(500).send({ message: "Invalid Token", err });
	}
}

import {
	verifyToken,
	generateToken,
	verifyRefreshToken,
} from "../utilities/token-utilities.js";

export default async function tokenMiddleware(req, res, next) {
	try {
		let decodedToken = await verifyToken(req.headers.authorization);
		req.headers.userId = decodedToken.payload.userId;
		next();
	} catch (err) {
		switch (err.name) {
			case "TokenExpiredError":
				await reIssueToken(req, res, next);
				break;
			default:
				res.status(500).send(err);
		}
	}
}

async function reIssueToken(req, res, next) {
	try {
		let decodedToken = await verifyRefreshToken(req.headers.refresh);
		let newToken = await generateToken(decodedToken.payload);
		res.setHeader("token", newToken);
		req.headers.userId = decodedToken.payload.userId;
		next();
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}

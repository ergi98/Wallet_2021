import { verifyToken } from "../utilities/token-utilities.js";

export default async function tokenMiddleware(req, res, next) {
	try {
		let decodedToken = await verifyToken(req.headers.authorization);
		req.headers.userId = decodedToken.payload.userId;
		next();
	} catch (err) {
		if (err.name === "TokenExpiredError") return res.sendStatus(403);
		else res.status(400).send({ message: "Invalid Token", err });
	}
}

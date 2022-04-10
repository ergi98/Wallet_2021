// JWT
import jwt from "jsonwebtoken";

async function generateToken(payload) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ payload },
			process.env.SECRET_KEY,
			{ expiresIn: "10m" },
			(err, token) => {
				err ? reject(err) : resolve(token);
			}
		);
	});
}

async function generateRefreshToken(payload) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ payload },
			process.env.REFRESH_SECRET_KEY,
			{ expiresIn: "1d" },
			(err, token) => {
				err ? reject(err) : resolve(token);
			}
		);
	});
}

function getToken(token) {
	if (!token) return "";
	let result = token.replace("Bearer", "").trim();
	return result;
}

async function verifyToken(bearerToken) {
	let token = getToken(bearerToken);
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
			err ? reject(err) : resolve(decoded);
		});
	});
}

async function verifyRefreshToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
			err ? reject(err) : resolve(decoded);
		});
	});
}

export { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken };

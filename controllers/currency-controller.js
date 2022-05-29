// Schema
import CurrencySchema from "../schemas/currency-schema.js";

// Aggregations
import { currencyAggregation } from "../aggregations/currency-aggregations.js";

async function getCurrenciesHelper(userId) {
	let today = new Date();

	let startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
	let endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

	const currencies = await CurrencySchema.aggregate(
		currencyAggregation(startOfDay, endOfDay, userId)
	);
	return currencies;
}

async function getCurrencyListWithLatestRates(req, res) {
	try {
		const currencies = await getCurrenciesHelper(req.headers.userId);
		res.status(200).send(currencies);
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

export { getCurrencyListWithLatestRates, getCurrenciesHelper };

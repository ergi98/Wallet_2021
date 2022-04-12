// Schema
import CurrencySchema from "../schemas/currency-schema.js";

async function getCurrencyRates(req, res) {
	try {
		const currencies = await CurrencySchema.aggregate([
			{
				$set: {
					rateForALL: { $ifNull: [{ $toDouble: "$rateForALL" }, 1] },
				},
			},
		]);
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

async function populateRatesFromBOA(req, res) {
	try {
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

export { getCurrencyRates, populateRatesFromBOA };

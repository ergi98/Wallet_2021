// Schema
import CurrencySchema from "../schemas/currency-schema.js";

// TODO: Change
async function getCurrencyListWithLatestRates(req, res) {
	try {
		let today = new Date();

		let startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
		let endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

		const currencies = await CurrencySchema.aggregate([
			{
				$lookup: {
					localField: "_id",
					from: "currency-rates",
					foreignField: "currency",
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $gte: ["$createdAt", startOfDay] },
										{ $lte: ["$createdAt", endOfDay] },
									],
								},
							},
						},
					],
					as: "rateForALL",
				},
			},
			{
				$set: {
					rateForALL: { $arrayElemAt: ["$rateForALL", 0] },
				},
			},
			{
				$set: {
					rateForALL: { $ifNull: [{ $toDouble: "$rateForALL.rateForALL" }, 1] },
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

export { getCurrencyListWithLatestRates };

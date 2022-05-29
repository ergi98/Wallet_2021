import mongoose from "mongoose";
import { populateUserCurrency } from "./transaction-aggregations.js";

const currencyAggregation = (startOfDay, endOfDay, userId) => [
	{
		$lookup: {
			from: "currency-rates",
			localField: "_id",
			foreignField: "currency",
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{ $lte: ["$createdAt", endOfDay] },
								{ $gte: ["$createdAt", startOfDay] },
							],
						},
					},
				},
			],
			as: "rates",
		},
	},
	{
		$set: {
			rates: { $arrayElemAt: ["$rates", 0] },
			user: mongoose.Types.ObjectId(userId),
		},
	},
	...populateUserCurrency,
	{
		$set: {
			rateToDefault: {
				$filter: {
					input: "$rates.rates",
					as: "rate",
					cond: { $eq: ["$$rate._id", "$user.defaultCurrency"] },
				},
			},
		},
	},
	{
		$set: {
			rateToDefault: { $arrayElemAt: ["$rateToDefault", 0] },
		},
	},
	{
		$set: {
			rateToDefault: { $ifNull: [{ $toDouble: "$rateToDefault.rate" }, 1] },
		},
	},
	{
		$project: {
			user: 0,
			rates: 0,
		},
	},
];

export { currencyAggregation };

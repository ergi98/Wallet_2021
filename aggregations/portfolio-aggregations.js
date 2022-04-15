import mongoose from "mongoose";

const getPortfoliosAggregation = (userId, portfolioId) => {
	let match = {
		user: mongoose.Types.ObjectId(userId),
	};

	if (portfolioId) match["_id"] = mongoose.Types.ObjectId(portfolioId);

	let aggregation = [
		{
			$match: match,
		},
		{
			$project: {
				user: 0,
				updatedAt: 0,
			},
		},
		{
			$lookup: {
				from: "portfolio-types",
				localField: "type",
				foreignField: "_id",
				as: "type",
			},
		},
		{
			$set: {
				type: { $arrayElemAt: ["$type", 0] },
			},
		},
    {
			$lookup: {
				from: "banks",
				localField: "bank",
				foreignField: "_id",
				as: "bank",
			},
		},
		{
			$set: {
				bank: { $arrayElemAt: ["$bank", 0] },
			},
		},
		{
			$unwind: {
				path: "$amounts",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: "currencies",
				foreignField: "_id",
				as: "amounts.currency",
				localField: "amounts.currency",
			},
		},
		{
			$set: {
				"amounts.currency": { $arrayElemAt: ["$amounts.currency", 0] },
				"amounts.amount": { $ifNull: [{ $toDouble: "$amounts.amount" }, 0] },
			},
		},
		{
			$group: {
				_id: "$_id",
				root: {
					$first: "$$ROOT",
				},
				amounts: {
					$push: "$amounts",
				},
			},
		},
		{
			$set: {
				"root.amounts": "$amounts",
			},
		},
		{
			$replaceRoot: { newRoot: "$root" },
		},
	];
	return aggregation;
};

export { getPortfoliosAggregation };

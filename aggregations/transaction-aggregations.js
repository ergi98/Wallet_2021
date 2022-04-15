import mongoose from "mongoose";

const getTransactionsAggregation = (transactionId, userId) => {
	let match = {
		deletedAt: { $exists: 0 },
		correctedBy: { $exists: 0 },
		correctedAt: { $exists: 0 },
		user: mongoose.Types.ObjectId(userId),
	};

	if (transactionId) match["_id"] = mongoose.Types.ObjectId(transactionId);

	let aggregation = [
		{
			$match: match,
		},
		{
			$set: {
				year: { $year: "$date" },
				month: { $month: "$date" },
				day: { $dayOfMonth: "$date" },
				amount: { $toDouble: "$amount" },
			},
		},
		{
			$lookup: {
				from: "currency-rates",
				localField: "currency",
				foreignField: "currency",
				let: {
					day: "$day",
					year: "$year",
					month: "$month",
				},
				pipeline: [
					{
						$set: {
							year: { $year: "$createdAt" },
							month: { $month: "$createdAt" },
							day: { $dayOfMonth: "$createdAt" },
						},
					},
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$day", "$$day"] },
									{ $eq: ["$year", "$$year"] },
									{ $eq: ["$month", "$$month"] },
								],
							},
						},
					},
					{
						$lookup: {
							from: "currencies",
							localField: "currency",
							foreignField: "_id",
							as: "currency",
						},
					},
					{
						$set: {
							currency: { $arrayElemAt: ["$currency", 0] },
						},
					},
					{
						$set: {
							"currency.rateForALL": {
								$ifNull: [{ $toDouble: "$rateForALL" }, 1],
							},
						},
					},
				],
				as: "currency",
			},
		},
		{
			$set: {
				currency: { $arrayElemAt: ["$currency", 0] },
			},
		},
		{
			$lookup: {
				from: "transaction-types",
				localField: "type",
				foreignField: "_id",
				as: "type",
				pipeline: [
					{
						$project: {
							__v: 0,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "sources",
				localField: "source",
				foreignField: "_id",
				as: "source",
				pipeline: [
					{
						$project: {
							name: 1,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "categories",
				localField: "category",
				foreignField: "_id",
				as: "category",
				pipeline: [
					{
						$project: {
							name: 1,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "portfolios",
				localField: "portfolio",
				foreignField: "_id",
				as: "portfolio",
				pipeline: [
					{
						$project: {
							description: 1,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "portfolios",
				localField: "from",
				foreignField: "_id",
				as: "from",
				pipeline: [
					{
						$project: {
							description: 1,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "portfolios",
				localField: "to",
				foreignField: "_id",
				as: "to",
				pipeline: [
					{
						$project: {
							description: 1,
						},
					},
				],
			},
		},
		{
			$set: {
				currency: "$currency.currency",
				to: { $arrayElemAt: ["$to", 0] },
				from: { $arrayElemAt: ["$from", 0] },
				type: { $arrayElemAt: ["$type", 0] },
				source: { $arrayElemAt: ["$source", 0] },
				category: { $arrayElemAt: ["$category", 0] },
				portfolio: { $arrayElemAt: ["$portfolio", 0] },
			},
		},
		{
			$project: {
				__v: 0,
				day: 0,
				user: 0,
				year: 0,
				month: 0,
			},
		},
	];

	return aggregation;
};

export { getTransactionsAggregation };

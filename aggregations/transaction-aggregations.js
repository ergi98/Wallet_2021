import mongoose from "mongoose";

const getTransactionsAggregation = (transactionId, userId) => {
	let match = {
		user: mongoose.Types.ObjectId(userId),
	};

	if (transactionId) match["_id"] = mongoose.Types.ObjectId(transactionId);

	match["deletedAt"] = { $exists: 0 };
	match["correctedBy"] = { $exists: 0 };
	match["correctedAt"] = { $exists: 0 };

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
				from: "currencies",
				localField: "currency",
				foreignField: "_id",
				let: {
					day: "$day",
					year: "$year",
					month: "$month",
				},
				pipeline: [
					{
						$lookup: {
							from: "currency-rates",
							localField: "_id",
							foreignField: "currency",
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
							],
							as: "rates",
						},
					},
					{
						$set: {
							rates: { $arrayElemAt: ["$rates", 0] },
						},
					},
					{
						$set: {
							rates: "$rates.rates",
						},
					},
					{
						$set: {
							rates: {
								$map: {
									input: "$rates",
									as: "rate",
									in: {
										acronym: "$$rate.acronym",
										rate: { $toDouble: "$$rate.rate" },
									},
								},
							},
						},
					},
				],
				as: "currency",
			},
		},
		{
			$lookup: {
				from: "transaction-types",
				localField: "type",
				foreignField: "_id",
				as: "type",
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
				to: { $arrayElemAt: ["$to", 0] },
				from: { $arrayElemAt: ["$from", 0] },
				type: { $arrayElemAt: ["$type", 0] },
				source: { $arrayElemAt: ["$source", 0] },
				currency: { $arrayElemAt: ["$currency", 0] },
				category: { $arrayElemAt: ["$category", 0] },
				portfolio: { $arrayElemAt: ["$portfolio", 0] },
			},
		},
		{
			$project: {
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

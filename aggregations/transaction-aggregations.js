import mongoose from "mongoose";

const populateRates = [
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
									_id: "$$rate._id",
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
];

const populateUserCurrency = [
	{
		$lookup: {
			from: "users",
			localField: "user",
			foreignField: "_id",
			as: "user",
			pipeline: [
				{
					$project: {
						_id: 0,
						defaultCurrency: 1,
					},
				},
			],
		},
	},
	{
		$set: {
			user: { $arrayElemAt: ["$user", 0] },
		},
	},
];

const getTransactionsAggregation = (
	transactionId,
	userId,
	pagination = null
) => {
	const match =
		pagination === null
			? {
					user: mongoose.Types.ObjectId(userId),
			  }
			: pagination.match;

	// If no pagination is provided fill the necessary fields to the match object
	// Pagination is populated and provides its own filtering
	if (pagination === null) {
		if (transactionId) match["_id"] = mongoose.Types.ObjectId(transactionId);

		match["deletedAt"] = { $exists: 0 };
		match["correctedBy"] = { $exists: 0 };
		match["correctedAt"] = { $exists: 0 };
	}

	let aggregation = [
		{
			$match: match,
		},
		pagination?.sort && { $sort: pagination.sort },
		// Sort by the given condition
		// Limit the returned results
		pagination?.limit && { $limit: pagination.limit },
		...populateRates,
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
	].filter(Boolean);

	return aggregation;
};

const homeStatisticsAggregation = (data) => {
	const otherStages = [
		{
			$lookup: {
				from: "transaction-types",
				localField: "type",
				foreignField: "_id",
				as: "type",
			},
		},
		...populateRates,
		{
			$set: {
				type: { $arrayElemAt: ["$type", 0] },
				currency: { $arrayElemAt: ["$currency", 0] },
			},
		},
		{
			$set: {
				rateToDefault: {
					$filter: {
						input: "$currency.rates",
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
			$set: {
				amountInDefault: {
					$multiply: ["$amount", "$rateToDefault"],
				},
			},
		},
		{
			$group: {
				_id: "$type.type",
				amount: { $sum: "$amountInDefault" },
			},
		},
		{
			$set: {
				type: "$_id",
				amount: { $toDouble: "$amount" },
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
	];
	const aggregation = [
		{
			$facet: {
				previous: [
					{
						$match: {
							user: mongoose.Types.ObjectId(data.userId),
							date: {
								$gte: data.prevStart,
								$lte: data.prevEnd,
							},
							deletedAt: { $exists: 0 },
							correctedAt: { $exists: 0 },
							correctedBy: { $exists: 0 },
						},
					},
					...populateUserCurrency,
					...otherStages,
				],
				today: [
					{
						$match: {
							user: mongoose.Types.ObjectId(data.userId),
							date: {
								$gte: data.start,
								$lte: data.end,
							},
							deletedAt: { $exists: 0 },
							correctedAt: { $exists: 0 },
							correctedBy: { $exists: 0 },
						},
					},
					...populateUserCurrency,
					...otherStages,
				],
				expenseChart: [
					{
						$match: {
							user: mongoose.Types.ObjectId(data.userId),
							type: mongoose.Types.ObjectId(data.expenseTypeId),
							deletedAt: { $exists: 0 },
							correctedAt: { $exists: 0 },
							correctedBy: { $exists: 0 },
						},
					},
					// Test this
					{
						$bucket: {
							groupBy: "$date",
							boundaries: data.boundaries,
							default: "other",
							output: {},
						},
					},
				],
			},
		},
	];

	return aggregation;
};

export { getTransactionsAggregation, homeStatisticsAggregation };

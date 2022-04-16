import mongoose from "mongoose";

const getPortfoliosAggregation = (userId, portfolioId) => {
	const match = {
		user: mongoose.Types.ObjectId(userId),
	};

	if (portfolioId) match["_id"] = mongoose.Types.ObjectId(portfolioId);

	const aggregation = [
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
		...populatePortfolioAmounts,
	];
	return aggregation;
};

const portfolioAmountAggregation = (
	userId,
	portfolioIds = [],
	onlyActive = true
) => {
	const match = {
		user: mongoose.Types.ObjectId(userId),
	};

	if (portfolioIds.length !== 0) {
		match["$or"] = portfolioIds.map((portfolioId) => {
			return {
				_id: mongoose.Types.ObjectId(portfolioId),
			};
		});
	}
	if (onlyActive) match["deletedAt"] = { $exists: 0 };

	const aggregation = [
		{
			$match: match,
		},
		{
			$project: {
				amounts: 1,
			},
		},
		...populatePortfolioAmounts,
	];

	return aggregation;
};

const populatePortfolioAmounts = [
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
			pipeline: [
				{
					$lookup: {
						from: "currency-rates",
						localField: "_id",
						foreignField: "currency",
						as: "rates",
						pipeline: [
							{
								// Match only the currency rates of TODAY (Latest)
								$match: {
									$expr: {
										$and: [
											// Start of today
											{
												$gte: [
													"$createdAt",
													new Date(new Date().setUTCHours(0, 0, 0, 0)),
												],
											},
											// End of today
											{
												$lte: [
													"$createdAt",
													new Date(new Date().setUTCHours(23, 59, 59, 999)),
												],
											},
										],
									},
								},
							},
						],
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

export { getPortfoliosAggregation, portfolioAmountAggregation };

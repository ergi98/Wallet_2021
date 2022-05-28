const currencyAggregation = (startOfDay, endOfDay) => [
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
		$unwind: {
			path: "$rates",
		},
	},
	{
		$set: {
			"rates.rate": { $ifNull: [{ $toDouble: "$rates.rate" }, 1] },
		},
	},
	{
		$group: {
			_id: "$_id",
			root: {
				$first: "$$ROOT",
			},
			rates: {
				$push: "$rates",
			},
		},
	},
	{
		$set: {
			"root.rates": "$rates",
		},
	},
	{
		$replaceRoot: { newRoot: "$root" },
	},
];

export { currencyAggregation };

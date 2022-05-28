import mongoose from "mongoose";

const getUserAggregation = (userId) => [
	{
		$match: {
			_id: mongoose.Types.ObjectId(userId),
			deleteAt: { $exists: false },
		},
	},
	{
		$lookup: {
			from: "currencies",
			localField: "defaultCurrency",
			foreignField: "_id",
			as: "defaultCurrency",
		},
	},
	{
		$set: {
			defaultCurrency: { $arrayElemAt: ["$defaultCurrency", 0] },
		},
	},
	{
		$project: {
			refresh: 0,
			password: 0,
			createdAt: 0,
			updatedAt: 0,
			lastLogIn: 0,
			lastLogOut: 0,
			"defaultCurrency.updatedAt": 0,
		},
	},
];

export { getUserAggregation };

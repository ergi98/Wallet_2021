// Mongoose
import mongoose from "mongoose";

// Utilities
import { exactDiff } from "../utilities/number.utilities.js";

// Schema
import TransactionSchema from "../schemas/transaction-schema.js";
import TransactionTypesSchema from "../schemas/transaction-types-schema.js";

async function getHomeStatistics(req, res) {
	try {
		let end = new Date(req.query.end);
		let start = new Date(req.query.start);

		// EOD = End of day
		let EODTimestamp = new Date(req.query.end).setUTCDate(end.getUTCDate() - 1);
		// SOD = Start of day
		let SODTimestamp = new Date(req.query.start).setUTCDate(
			start.getUTCDate() - 1
		);

		let prevEnd = new Date(EODTimestamp);
		let prevStart = new Date(SODTimestamp);

		const otherStages = [
			{
				$lookup: {
					from: "transaction-types",
					localField: "type",
					foreignField: "_id",
					as: "typeData",
				},
			},
			{
				$set: {
					type: { $arrayElemAt: ["$typeData", 0] },
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

		let data = await TransactionSchema.aggregate([
			{
				$facet: {
					previous: [
						{
							$match: {
								user: mongoose.Types.ObjectId(req.headers.userId),
								date: {
									$gte: prevStart,
									$lte: prevEnd,
								},
								deletedAt: { $exists: 0 },
								correctedAt: { $exists: 0 },
								correctedBy: { $exists: 0 },
							},
						},
						...otherStages,
					],
					today: [
						{
							$match: {
								user: mongoose.Types.ObjectId(req.headers.userId),
								date: {
									$gte: start,
									$lte: end,
								},
								deletedAt: { $exists: 0 },
								correctedAt: { $exists: 0 },
								correctedBy: { $exists: 0 },
							},
						},
						...otherStages,
					],
					transactions: [
						{
							$match: {
								user: mongoose.Types.ObjectId(req.headers.userId),
								date: {
									$gte: start,
									$lte: end,
								},
								deletedAt: { $exists: 0 },
								correctedAt: { $exists: 0 },
								correctedBy: { $exists: 0 },
							},
						},
						{
							$sort: { date: -1 },
						},
						{
							$limit: 20,
						},
						{
							$set: {
								amount: {
									$toDouble: "$amount",
								},
								amountInDefault: {
									$toDouble: "$amountInDefault",
								},
								currencyRate: {
									$toDouble: "$currencyRate",
								},
							},
						},
						{
							$project: {
								journals: 0,
								user: 0,
							},
						},
						{
							$lookup: {
								from: "transactionTypes",
								foreignField: "_id",
								localField: "type",
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
								from: "sources",
								foreignField: "_id",
								localField: "source",
								as: "source",
							},
						},
						{
							$set: {
								source: { $arrayElemAt: ["$source", 0] },
							},
						},
						{
							$lookup: {
								from: "portfolios",
								foreignField: "_id",
								localField: "portfolio",
								as: "portfolio",
							},
						},
						{
							$set: {
								portfolio: { $arrayElemAt: ["$portfolio", 0] },
							},
						},
						{
							$lookup: {
								from: "currencies",
								foreignField: "_id",
								localField: "currency",
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
								type: "$type.type",
								source: "$source.name",
								portfolio: "$portfolio.description",
							},
						},
					],
				},
			},
		]);

		data = data[0];

		const transactionTypes = await TransactionTypesSchema.find({});

		const format = (arr) => {
			let obj = {};
			if (arr.length === 0) {
				for (let element of transactionTypes) {
					obj[element.type] = {
						amount: 0,
					};
				}
				return obj;
			} else {
				for (let element of arr) {
					obj[element.type] = {
						amount: element.amount,
					};
				}
				for (let element of transactionTypes) {
					if (obj[element.type] === undefined) {
						obj[element.type] = {
							amount: 0,
						};
					}
				}
				return obj;
			}
		};

		const calculatePercentChange = (today, previous) => {
			for (let element of transactionTypes) {
				let previousVal = previous[element.type]["amount"];
				let todayVal = today[element.type]["amount"];
				today[element.type]["percent"] =
					previousVal === 0
						? 0
						: (exactDiff(todayVal, previousVal) / previousVal) * 100;
			}
		};

		data.today = format(data.today);
		data.previous = format(data.previous);
		calculatePercentChange(data.today, data.previous);

		res.status(200).send({ data });
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
}

export { getHomeStatistics };

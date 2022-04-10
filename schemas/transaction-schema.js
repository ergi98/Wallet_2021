import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	amount: {
		required: true,
		type: mongoose.Decimal128,
	},
	amountInDefault: {
		required: true,
		type: mongoose.Decimal128,
	},
	description: {
		type: String,
		required: true,
	},
	journals: {
		required: true,
		ref: "journals",
		type: ["ObjectId"],
	},
	user: {
		ref: "users",
		required: true,
		type: "ObjectId",
	},
	type: {
		required: true,
		type: "ObjectId",
		ref: "transactionTypes",
	},
	source: {
		ref: "sources",
		required: true,
		type: "ObjectId",
	},
	portfolio: {
		required: true,
		type: "ObjectId",
		ref: "portfolios",
	},
	currency: {
		required: true,
		type: "ObjectId",
		ref: "currencies",
	},
	currencyRate: {
		required: true,
		type: mongoose.Decimal128,
	},
	correctedBy: {
		type: "ObjectId",
		ref: "transactions",
	},
	correctedAt: {
		type: Date,
	},
	deletedAt: {
		type: Date,
	},
});

export default mongoose.model("transactions", transactionSchema);

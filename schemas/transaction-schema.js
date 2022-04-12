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
	// Amounts
	amount: {
		required: true,
		type: mongoose.Decimal128,
	},
	amountInDefault: {
		required: true,
		type: mongoose.Decimal128,
	},
	// Categorization
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
		ref: "transaction-types",
	},
	// Currency
	currency: {
		required: true,
		type: "ObjectId",
		ref: "currencies",
	},
	currencyRate: {
		required: true,
		type: mongoose.Decimal128,
	},
	// Desc - Earing & Expense
	description: {
		type: String,
	},
	// Categorization - Earning & Expense
	portfolio: {
		type: "ObjectId",
		ref: "portfolios",
	},
	// Categorization - Earning
	source: {
		ref: "sources",
		type: "ObjectId",
	},
	// Categorization - Expense
	category: {
		ref: "categories",
		type: "ObjectId",
	},
	// Categorization - Transfer
	from: {
		ref: "portfolios",
		type: "ObjectId",
	},
	to: {
		ref: "portfolios",
		type: "ObjectId",
	},
	// Location - Expense
	location: {
		longitude: {
			type: String,
		},
		latitude: {
			type: String,
		},
	},
	// Other
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
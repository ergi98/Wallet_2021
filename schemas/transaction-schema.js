import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
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
		// Desc - Earing & Expense
		description: {
			trim: true,
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
			longitude: { type: String },
			latitude: { type: String },
		},
		// Other
		correctedBy: {
			type: "ObjectId",
			ref: "transactions",
		},
		deletedAt: { type: Date },
		correctedAt: { type: Date },
	},
	{ versionKey: false }
);

export default mongoose.model("transactions", transactionSchema);

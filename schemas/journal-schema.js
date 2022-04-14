import mongoose from "mongoose";

const journalsSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	type: {
		required: true,
		type: "ObjectId",
		ref: "journal-types",
	},
	user: {
		ref: "users",
		required: true,
		type: "ObjectId",
	},
	transaction: {
		required: true,
		type: "ObjectId",
		ref: "transactions",
	},
	portfolio: {
		type: "ObjectId",
		ref: "portfolios",
	},
	category: {
		type: "ObjectId",
		ref: "categories",
	},
	source: {
		type: "ObjectId",
		ref: "sources",
	},
	previousBalance: {
		required: true,
		type: mongoose.Decimal128,
	},
	amount: {
		required: true,
		type: mongoose.Decimal128,
	},
	followingBalance: {
		required: true,
		type: mongoose.Decimal128,
	},
});

export default mongoose.model("journals", journalsSchema);

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
		ref: "journalTypes",
	},
	user: {
		ref: "users",
		required: true,
		type: "ObjectId",
	},
	portfolio: {
		required: true,
		type: "ObjectId",
		ref: "portfolios",
	},
	transaction: {
		required: true,
		type: "ObjectId",
		ref: "transactions",
	},
	serialNumber: {
		type: Number,
		required: true,
	},
});

export default mongoose.model("journals", journalsSchema);

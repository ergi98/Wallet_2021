import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
		},
		amounts: {
			type: [
				{
					currency: {
						type: "ObjectId",
						ref: "currencies",
					},
					amount: {
						type: mongoose.Decimal128,
					},
				},
			],
		},
		user: {
			ref: "users",
			required: true,
			type: "ObjectId",
		},
		type: {
			required: true,
			type: "ObjectId",
			ref: "portfolio-types",
		},
		color: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		lastUsedAt: {
			type: Date,
			required: false,
		},
		deletedAt: {
			type: Date,
			required: false,
		},
		updatedAt: {
			type: Date,
			required: false,
		},
		// Virtual Wallet
		cvc: {
			type: String,
		},
		validity: {
			type: Date,
		},
		bank: {
			type: "ObjectId",
			ref: "banks",
		},
		cardNumber: {
			type: String,
		},
	},
	{ versionKey: false }
);

export default mongoose.model("portfolios", portfolioSchema);

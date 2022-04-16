import mongoose from "mongoose";

const currencySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		symbol: {
			type: String,
			required: true,
		},
		acronym: {
			type: String,
			required: true,
		},
		updatedAt: {
			type: Date,
			required: true,
		},
	},
	{ versionKey: false }
);

export default mongoose.model("currencies", currencySchema);

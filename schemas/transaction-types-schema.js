import mongoose from "mongoose";

const transactionTypesSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false }
);

export default mongoose.model("transaction-types", transactionTypesSchema);

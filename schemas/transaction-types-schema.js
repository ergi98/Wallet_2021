import mongoose from "mongoose";

const transactionTypesSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
});

export default mongoose.model("transaction-types", transactionTypesSchema);

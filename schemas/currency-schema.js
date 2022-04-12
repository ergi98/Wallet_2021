import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
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
	rateForALL: {
		type: mongoose.Decimal128,
		default: 1,
	},
});

export default mongoose.model("currencies", currencySchema);

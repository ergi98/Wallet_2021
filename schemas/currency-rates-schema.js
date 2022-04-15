import mongoose from "mongoose";

const currencyRatesSchema = new mongoose.Schema(
	{
		currency: {
			required: true,
			type: "ObjectId",
			ref: "currencies",
		},
		rateForALL: {
			default: 1,
			required: true,
			type: mongoose.Decimal128,
		},
		createdAt: {
			type: Date,
			required: true,
		},
	},
	{ versionKey: false }
);

export default mongoose.model("currency-rates", currencyRatesSchema);

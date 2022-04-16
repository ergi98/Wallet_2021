import mongoose from "mongoose";

const SingleCurrencySchema = new mongoose.Schema(
	{
		acronym: { type: String, required: true },
		rate: { type: mongoose.Types.Decimal128, required: true },
	},
	{ _id: false }
);

const currencyRatesSchema = new mongoose.Schema(
	{
		currency: {
			required: true,
			type: "ObjectId",
			ref: "currencies",
		},
		rates: { type: [SingleCurrencySchema], required: true },
		createdAt: { type: Date, required: true },
	},
	{ versionKey: false }
);

export default mongoose.model("currency-rates", currencyRatesSchema);

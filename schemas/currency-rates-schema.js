import mongoose from "mongoose";

const SingleCurrencySchema = new mongoose.Schema(
	{
		_id: { type: "ObjectId", ref: "currencies" },
		acronym: { type: String, required: true },
		rate: { type: mongoose.Decimal128, required: true },
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

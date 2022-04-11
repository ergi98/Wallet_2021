import mongoose from "mongoose";

const portfolioTypesSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
});

export default mongoose.model("portfolio-types", portfolioTypesSchema);

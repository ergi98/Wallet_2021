import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false }
);

export default mongoose.model("banks", bankSchema);

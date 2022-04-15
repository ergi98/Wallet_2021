import mongoose from "mongoose";

const journalTypesSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false }
);

export default mongoose.model("journal-types", journalTypesSchema);

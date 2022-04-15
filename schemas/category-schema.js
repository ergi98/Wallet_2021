import mongoose from "mongoose";

const sourcesSchema = new mongoose.Schema(
	{
		user: {
			ref: "users",
			required: true,
			type: "ObjectId",
		},
		name: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		deletedAt: { type: Date },
		updatedAt: { type: Date },
		lastUsedAt: { type: Date },
	},
	{ versionKey: false }
);

export default mongoose.model("categories", sourcesSchema);

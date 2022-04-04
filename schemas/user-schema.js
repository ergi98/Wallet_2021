import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	personal: {
		name: {
			type: String,
			required: true,
		},
		surname: {
			type: String,
			required: true,
		},
		age: { type: Number },
		gender: { type: String },
		birthday: { type: Date },
		profession: { type: String },
		employer: { type: String },
	},
	defaultCurrency: {
		type: ["ObjectId"],
		ref: "currencies",
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	refresh: { type: String },
	deletedAt: { type: Date },
	lastLogIn: { type: Date },
	lastLogOut: { type: Date },
	updatedAt: { type: Date },
});

export default mongoose.model("users", userSchema);

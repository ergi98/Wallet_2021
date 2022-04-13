// Model
import BankSchema from "../schemas/bank-schema.js";

async function getBankList(req, res) {
	try {
		let list = await BankSchema.find({});
		res.status(200).send(list);
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	}
}

export { getBankList };

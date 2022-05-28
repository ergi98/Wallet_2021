// Model
import BankSchema from "../schemas/bank-schema.js";

async function getBanksHelper() {
	const banks = await BankSchema.find({});
	return banks;
}

async function getBankList(req, res) {
	try {
		const banks = await getBanksHelper();
		res.status(200).send({ banks });
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

export { getBankList, getBanksHelper };

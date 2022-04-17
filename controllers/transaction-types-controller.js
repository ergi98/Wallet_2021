import TransactionTypesSchema from "../schemas/transaction-types-schema.js";

async function getTransactionTypes(req, res) {
	try {
		const types = await TransactionTypesSchema.find({});
		res.status(200).send(types);
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

export { getTransactionTypes };

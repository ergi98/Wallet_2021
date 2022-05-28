import PortfolioTypesSchema from "../schemas/portfolio-types-schema.js";

async function getPortfolioTypesHelper() {
	const types = await PortfolioTypesSchema.find({});
	return types;
}
async function getPortfolioTypes(req, res) {
	try {
		const types = await getPortfolioTypesHelper();
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

export { getPortfolioTypes, getPortfolioTypesHelper };

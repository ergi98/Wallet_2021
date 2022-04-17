import PortfolioTypesSchema from "../schemas/portfolio-types-schema.js";

async function getPortfolioTypes(req, res) {
	try {
		const types = await PortfolioTypesSchema.find({});

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

export { getPortfolioTypes };

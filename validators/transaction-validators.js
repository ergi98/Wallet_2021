import Joi from "joi";

const maxDescriptionLength = 100;

const homeStatisticsSchema = Joi.object({
	start: Joi.date().required(),
	end: Joi.date().required(),
});

const baseTransactionSchema = Joi.object({
	amount: Joi.number().positive().precision(2).required(),
	type: Joi.string().hex().length(24).required(),
});

const expenseTransactionSchema = Joi.object({
	date: Joi.date().required(),
	category: Joi.string().hex().length(24).required(),
	currency: Joi.string().hex().length(24).required(),
	portfolio: Joi.string().hex().length(24).required(),
	description: Joi.string().max(maxDescriptionLength).required(),
	location: Joi.object({
		longitude: Joi.number().required(),
		latitude: Joi.number().required(),
	}),
}).concat(baseTransactionSchema);

const earningTransactionSchema = Joi.object({
	date: Joi.date().required(),
	source: Joi.string().hex().length(24).required(),
	currency: Joi.string().hex().length(24).required(),
	portfolio: Joi.string().hex().length(24).required(),
	description: Joi.string().max(maxDescriptionLength).required(),
}).concat(baseTransactionSchema);

const transferTransactionSchema = Joi.object({
	to: Joi.string().hex().length(24).required(),
	from: Joi.string().hex().length(24).required(),
	currency: Joi.string().hex().length(24).required(),
}).concat(baseTransactionSchema);

export {
	homeStatisticsSchema,
	expenseTransactionSchema,
	earningTransactionSchema,
	transferTransactionSchema,
};

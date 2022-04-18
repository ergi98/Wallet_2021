import Joi from "joi";

const maxDescriptionLength = 100;

// Cant record transactions that are done prior to 01 January 2012
const earliestTransactionDate = new Date(Date.UTC(2012, 0, 1, 0, 0, 0, 0));

const homeStatisticsSchema = Joi.object({
	start: Joi.date().iso().greater(earliestTransactionDate).required(),
	end: Joi.date().iso().less("now").greater(Joi.ref("start")).required(),
});

const baseTransactionSchema = Joi.object({
	amount: Joi.number().precision(2).positive().required(),
	type: Joi.string().hex().length(24).required(),
});

const expenseTransactionSchema = Joi.object({
	date: Joi.date()
		.iso()
		.less("now")
		.greater(earliestTransactionDate)
		.required(),
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
	date: Joi.date()
		.iso()
		.less("now")
		.greater(earliestTransactionDate)
		.required(),
	source: Joi.string().hex().length(24).required(),
	currency: Joi.string().hex().length(24).required(),
	portfolio: Joi.string().hex().length(24).required(),
	description: Joi.string().max(maxDescriptionLength).required(),
}).concat(baseTransactionSchema);

const correctEarningTransactionSchema = Joi.object({
	amount: Joi.number().precision(2).positive().required(),
	date: Joi.date()
		.iso()
		.less("now")
		.greater(earliestTransactionDate)
		.required(),
	source: Joi.string().hex().length(24).required(),
	currency: Joi.string().hex().length(24).required(),
	portfolio: Joi.string().hex().length(24).required(),
	description: Joi.string().max(maxDescriptionLength).required(),
});

const transferTransactionSchema = Joi.object({
	to: Joi.string().hex().length(24).required(),
	from: Joi.string().hex().length(24).invalid(Joi.ref("to")).required(),
	currency: Joi.string().hex().length(24).required(),
}).concat(baseTransactionSchema);

export {
	homeStatisticsSchema,
	expenseTransactionSchema,
	earningTransactionSchema,
	transferTransactionSchema,
	correctEarningTransactionSchema,
};

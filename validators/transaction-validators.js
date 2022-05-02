import Joi from "joi";

const maxDescriptionLength = 100;

// Cant record transactions that are done prior to 01 January 2012
const earliestTransactionDate = new Date(Date.UTC(2012, 0, 1, 0, 0, 0, 0));

const homeStatisticsSchema = Joi.object({
	start: Joi.date().iso().greater(earliestTransactionDate).required(),
	end: Joi.date().iso().greater(Joi.ref("start")).required(),
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
	id: Joi.string().hex().length(24).required(),
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

const correctExpenseTransactionSchema = Joi.object({
	id: Joi.string().hex().length(24).required(),
	amount: Joi.number().precision(2).positive().required(),
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
});

const transferTransactionSchema = Joi.object({
	to: Joi.string().hex().length(24).required(),
	from: Joi.string().hex().length(24).invalid(Joi.ref("to")).required(),
	currency: Joi.string().hex().length(24).required(),
}).concat(baseTransactionSchema);

const getTransactionsSchema = Joi.object({
	last: Joi.object({
		value: Joi.alternatives().conditional("sortBy", {
			is: "date",
			then: Joi.date().iso(),
			otherwise: Joi.number().precision(2).positive(),
		}),
		date: Joi.date().iso(),
	}),
	description: Joi.string().trim(),
	types: Joi.array().items(Joi.string().hex().length(24)).unique(),
	sources: Joi.array().items(Joi.string().hex().length(24)).unique(),
	categories: Joi.array().items(Joi.string().hex().length(24)).unique(),
	currencies: Joi.array().items(Joi.string().hex().length(24)).unique(),
	portfolios: Joi.array().items(Joi.string().hex().length(24)).unique(),
	status: Joi.array()
		.items(Joi.string().valid("active", "deleted", "corrected").required())
		.unique(),
	dateRange: Joi.object({
		from: Joi.date().iso(),
		to: Joi.date().iso(),
	}).and("from", "to"),
	amountRange: Joi.object({
		from: Joi.number().precision(2).positive(),
		to: Joi.number().precision(2).positive().greater(Joi.ref("from")),
	}).and("from", "to"),
	sortBy: Joi.string().default("date").valid("date", "amount"),
	direction: Joi.string()
		.valid("descending", "ascending")
		.default("descending"),
});

export {
	homeStatisticsSchema,
	getTransactionsSchema,
	expenseTransactionSchema,
	earningTransactionSchema,
	transferTransactionSchema,
	correctEarningTransactionSchema,
	correctExpenseTransactionSchema,
};

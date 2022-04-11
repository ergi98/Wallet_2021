import Joi from "joi";

const homeStatisticsSchema = Joi.object({
	start: Joi.date().required(),
	end: Joi.date().required(),
});

const expenseTransactionSchema = Joi.object({})

export { homeStatisticsSchema };

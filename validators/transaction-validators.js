import Joi from "joi";

const homeStatisticsSchema = Joi.object({
	start: Joi.date().required(),
	end: Joi.date().required(),
});

export { homeStatisticsSchema };

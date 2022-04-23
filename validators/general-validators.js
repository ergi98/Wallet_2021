const objectIdSchema = Joi.string().hex().length(24).required();

export { objectIdSchema };

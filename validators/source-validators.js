import Joi from "joi";

const minNameLength = 1;
const maxNameLength = 100;

const objectIdSchema = Joi.string().hex().length(24).required();

const createSourceSchema = Joi.object({
	name: Joi.string().min(minNameLength).max(maxNameLength).required(),
});

const editSourceSchema = Joi.object({
	id: Joi.string().hex().length(24).required(),
}).concat(createSourceSchema);

export { createSourceSchema, editSourceSchema, objectIdSchema };

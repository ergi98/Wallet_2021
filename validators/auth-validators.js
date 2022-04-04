import Joi from "joi";

// Constants
import {
	usernameMinLength,
	usernameMaxLength,
	usernameRegex,
	passwordMinLength,
	passwordMaxLength,
	passwordRegex,
	nameMaxLength,
} from "../shared/auth-constants.js";

const loginSchema = Joi.object({
	username: Joi.string()
		.min(usernameMinLength)
		.max(usernameMaxLength)
		.pattern(usernameRegex)
		.required(),
	password: Joi.string()
		.min(passwordMinLength)
		.max(passwordMaxLength)
		.pattern(passwordRegex)
		.required(),
});

const signUpSchema = Joi.object({
	personal: Joi.object({
		name: Joi.string().max(nameMaxLength).required(),
		surname: Joi.string().max(nameMaxLength).required(),
		gender: Joi.string().valid("M", "F", "TG", "NB/C").optional(),
		birthday: Joi.date()
			.less("now")
			.greater(new Date(1900, 0).toISOString())
			.optional(),
		employer: Joi.string().max(nameMaxLength).optional(),
		profession: Joi.string().max(nameMaxLength).optional(),
	}),
	defaultCurrency: Joi.string().hex().length(24).required(),
}).concat(loginSchema);

const usernameSchema = Joi.string()
	.min(usernameMinLength)
	.max(usernameMaxLength)
	.pattern(usernameRegex)
	.required();

export { loginSchema, usernameSchema, signUpSchema };

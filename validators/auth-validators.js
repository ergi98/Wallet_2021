import Joi from "joi";

// Constants
const usernameMinLength = 3;
const usernameMaxLength = 30;

const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]*$/;

const passwordMinLength = 8;
const passwordMaxLength = 30;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/;

const nameMaxLength = 100;

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

const passwordSchema = Joi.string()
	.min(passwordMinLength)
	.max(passwordMaxLength)
	.pattern(passwordRegex)
	.required();

const signUpSchema = Joi.object({
	personal: Joi.object({
		name: Joi.string().max(nameMaxLength).required(),
		surname: Joi.string().max(nameMaxLength).required(),
		gender: Joi.string().valid("M", "F", "TG", "NB/C").allow(""),
		birthday: Joi.date()
			.less("now")
			.greater(new Date(1900, 0).toISOString())
			.allow("", null),
		employer: Joi.string().max(nameMaxLength).allow(""),
		profession: Joi.string().max(nameMaxLength).allow(""),
	}),
}).concat(loginSchema);

const usernameSchema = Joi.string()
	.min(usernameMinLength)
	.max(usernameMaxLength)
	.pattern(usernameRegex)
	.required();

const editUserSchema = Joi.object({
	username: Joi.string()
		.min(usernameMinLength)
		.max(usernameMaxLength)
		.pattern(usernameRegex)
		.required(),
	defaultCurrency: Joi.string().hex().length(24).required(),
	personal: Joi.object({
		name: Joi.string().max(nameMaxLength).required(),
		surname: Joi.string().max(nameMaxLength).required(),
		gender: Joi.string().valid("M", "F", "TG", "NB/C").allow(""),
		birthday: Joi.date()
			.less("now")
			.greater(new Date(1900, 0).toISOString())
			.allow("", null),
		employer: Joi.string().max(nameMaxLength).allow(""),
		profession: Joi.string().max(nameMaxLength).allow(""),
	}),
});

export {
	loginSchema,
	signUpSchema,
	usernameSchema,
	editUserSchema,
	passwordSchema,
};

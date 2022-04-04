import Joi from "joi";

// Constants
import {
	usernameMinLength,
	usernameMaxLength,
	usernameRegex,
	passwordMinLength,
	passwordMaxLength,
	passwordRegex,
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

export { loginSchema };

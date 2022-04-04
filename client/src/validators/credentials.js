import * as Yup from "yup";
import { parseDateString } from "../utilities/date-utilities.ts";

const usernameMaxLength = 30;
const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]*$/;

const passwordMinLength = 8;
const passwordMaxLength = 30;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/;

const usernameRules = [
	"Can contain alphanumerical characters",
	"Can contain underscores and periods",
	"Can not end or start with a period",
	"Can not have consecutive periods",
	`Must be less than ${usernameMaxLength} characters`,
];

const passwordRules = [
	`Must be at least ${passwordMinLength} characters`,
	`Must be less than ${passwordMaxLength} characters`,
	`Must contain at least 1 uppercase letter`,
	`Must contain at least 1 lowercase letter`,
	`Must contain at least 1 number`,
];

const loginSchema = Yup.object({
	username: Yup.string()
		.required("Username is required")
		.max(usernameMaxLength, `Must be ${usernameMaxLength} characters or less`)
		.matches(usernameRegex, "Invalid username format"),
	password: Yup.string()
		.required("Password is required")
		.min(passwordMinLength, `Must be ${passwordMinLength} characters or more`)
		.max(passwordMaxLength, `Must be ${passwordMaxLength} characters or less`)
		.matches(passwordRegex, "Invalid password format"),
});

const nameMaxLength = 100;
const introductionSchema = Yup.object({
	name: Yup.string()
		.required("First name is required")
		.max(nameMaxLength, `Must be ${nameMaxLength} characters or less`),
	surname: Yup.string()
		.required("Last name is required")
		.max(nameMaxLength, `Must be ${nameMaxLength} characters or less`),
});

const personalInfoSchema = Yup.object({
	gender: Yup.string().oneOf(["", "M", "F", "TG", "NB/C"]),
	birthday: Yup.date()
		.transform(parseDateString)
		.min(new Date(1900, 0), "You can not possibly be this old! 🧐")
		.max(new Date(), "You are not born yet! 😱")
		.nullable(),
	employer: Yup.string().max(
		nameMaxLength,
		`Must be ${nameMaxLength} characters or less`
	),
	profession: Yup.string().max(
		nameMaxLength,
		`Must be ${nameMaxLength} characters or less`
	),
	// defaultCurrency: Yup.string()
	//   .required("Currency is required")
	//   .oneOf(["ALL", "EUR", "USD", "GBP", "AUD"]),
});

const signUpSchema = Yup.object({})
	.concat(introductionSchema)
	.concat(personalInfoSchema)
	.concat(loginSchema);

export {
	loginSchema,
	signUpSchema,
	introductionSchema,
	personalInfoSchema,
	usernameRules,
	passwordRules,
};

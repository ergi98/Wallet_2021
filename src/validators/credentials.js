import * as Yup from "yup";
import { convertToUTC, parseDateString } from "../utilities/date-utilities.ts";

const usernameMaxLength = 30;
const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]*$/;

const passwordMinLength = 8;
const passwordMaxLength = 30;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/;

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

// TODO: Determine signup joi

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
    .min(
      convertToUTC(new Date(1900, 0)),
      "You can not possibly be this old! 🧐"
    )
    .max(convertToUTC(new Date()), "You are not born yet! 😱")
    .nullable(),
  employer: Yup.string().max(
    nameMaxLength,
    `Must be ${nameMaxLength} characters or less`
  ),
  profession: Yup.string().max(
    nameMaxLength,
    `Must be ${nameMaxLength} characters or less`
  ),
  defaultCurrency: Yup.string()
    .required("Currency is required")
    .oneOf(["ALL", "EUR", "USD", "GBP", "AUD"]),
});

const signUpSchema = Yup.object({
  username: Yup.string(),
  password: Yup.string(),
  portfolios: Yup.array(),
  sources: Yup.array(),
  categories: Yup.array(),
  frequentPlaces: Yup.array(),
})
  .concat(introductionSchema)
  .concat(personalInfoSchema);

export { loginSchema, signUpSchema, introductionSchema, personalInfoSchema };

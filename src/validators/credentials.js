import * as Yup from "yup";

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

export { loginSchema };

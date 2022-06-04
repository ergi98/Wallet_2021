import * as Yup from "yup";
import { parseDateString } from "../utilities/date-utilities.ts";

const maxDescriptionLength = 100;

// Cant record transactions that are done prior to 01 January 2012
const earliestTransactionDate = new Date(Date.UTC(2012, 0, 1, 0, 0, 0, 0));

const newTransactionSchema = (types) =>
	Yup.object({
		type: Yup.string().length(24, "Invalid transaction type").required(),
		amount: Yup.number()
			.positive("Amount must be positive")
			.test(
				"precision-test",
				"Amount must have at most 2 digits after the decimal point",
				(number) => {
					const stringNumber = number.toString();
					const [, decimal] = stringNumber.split(".");
					if (!decimal || (decimal && decimal.length <= 2)) return true;
					else return false;
				}
			)
			.required(),
		currency: Yup.string().length(24, "Invalid currency").required(),
		// Only required on transfer
		to: Yup.string().when("type", {
			is: types.transfer,
			then: (schema) => schema.length(24, "Invalid portfolio").required(),
			otherwise: (schema) => schema,
		}),
		from: Yup.string().when("type", {
			is: types.transfer,
			then: (schema) =>
				schema
					.length(24, "Invalid portfolio")
					.notOneOf([Yup.ref("to")]) // Different than the to portfolio
					.required(),
			otherwise: (schema) => schema,
		}),
		date: Yup.date().when("type", {
			is: (value) => value !== types.transfer,
			then: (schema) =>
				schema
					.transform(parseDateString)
					.min(earliestTransactionDate, "Must be later than 01 January 2012")
					.required(),
			otherwise: (schema) => schema.nullable(),
		}),
		portfolio: Yup.string().when("type", {
			is: (value) => value !== types.transfer,
			then: (schema) => schema.length(24, "Invalid portfolio").required(),
			otherwise: (schema) => schema,
		}),
		description: Yup.string().when("type", {
			is: (value) => value !== types.transfer,
			then: (schema) =>
				schema
					.max(
						maxDescriptionLength,
						`Description must be at most ${maxDescriptionLength} characters.`
					)
					.required(),
			otherwise: (schema) => schema,
		}),
		category: Yup.string().when("type", {
			is: types.expense,
			then: (schema) => schema.length(24, "Invalid category").required(),
			otherwise: (schema) => schema,
		}),
		location: Yup.object({
			longitude: Yup.number().when("type", {
				is: types.expense,
				then: (schema) => schema.required(),
				otherwise: (schema) => schema,
			}),
			latitude: Yup.number().when("type", {
				is: types.expense,
				then: (schema) => schema.required(),
				otherwise: (schema) => schema,
			}),
		}).noUnknown(true, "Invalid location"),
		source: Yup.string().when("type", {
			is: types.earning,
			then: (schema) => schema.length(24, "Invalid source").required(),
			otherwise: (schema) => schema,
		}),
	}).noUnknown(true, "Unknown form fields");

const editTransactionSchema = (types) =>
	Yup.object({
		id: Yup.string().length(24, "Invalid transaction id").required(),
	})
		.concat(newTransactionSchema(types))
		.noUnknown(true, "Unknown form fields");

export { newTransactionSchema, editTransactionSchema };

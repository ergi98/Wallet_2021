import Joi from "joi";

const cardNumberRegex = /([0-9]){16}/;
const maxDescriptionLength = 100;

const objectIdSchema = Joi.string().hex().length(24).required();

const walletSchema = Joi.object({
	type: Joi.string().hex().length(24).required(),
	description: Joi.string().max(maxDescriptionLength).required(),
	color: Joi.string()
		.valid("red", "blue", "gray", "orange", "green")
		.required(),
});

const virtualWalletSchema = Joi.object({
	validity: Joi.date().required(),
	cvc: Joi.string().length(3).required(),
	bank: Joi.string().hex().length(24).required(),
	cardNumber: Joi.string().length(16).pattern(cardNumberRegex).required(),
}).concat(walletSchema);

const editWalletSchema = Joi.object({
	id: Joi.string().hex().length(24).required(),
	description: Joi.string().max(maxDescriptionLength).required(),
	color: Joi.string()
		.valid("red", "blue", "gray", "orange", "green")
		.required(),
});

const editVirtualWalletSchema = Joi.object({
	id: Joi.string().hex().length(24).required(),
	description: Joi.string().max(maxDescriptionLength).required(),
	color: Joi.string()
		.valid("red", "blue", "gray", "orange", "green")
		.required(),
	validity: Joi.date().required(),
	cvc: Joi.string().length(3).required(),
	bank: Joi.string().hex().length(24).required(),
	cardNumber: Joi.string().length(16).pattern(cardNumberRegex).required(),
});

export {
	objectIdSchema,
	walletSchema,
	virtualWalletSchema,
	editWalletSchema,
	editVirtualWalletSchema,
};
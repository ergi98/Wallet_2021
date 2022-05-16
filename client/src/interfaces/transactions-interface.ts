interface BaseTransaction {
	amount: number;
	type: string;
}

interface SourceOrCategory {
	_id: string;
	name: string;
}

interface TransactionCurrency {
	_id: string;
	name: string;
	symbol: string;
	acronym: string;
	rates: Array<CurrencyRates> | null;
}

interface CurrencyRates {
	_id: string;
	rate: number;
	acronym: string;
}

interface TransactionPortfolio {
	_id: string;
	description: string;
}

interface EarningTransaction extends BaseTransaction {
	date: string;
	description: string;
	source: SourceOrCategory;
	currency: TransactionCurrency;
	portfolio: TransactionPortfolio;
}

interface ExpenseTransaction extends BaseTransaction {
	date: string;
	description: string;
	category: SourceOrCategory;
	location: TransactionLocation;
	currency: TransactionCurrency;
	portfolio: TransactionPortfolio;
}

interface TransferTransaction extends BaseTransaction {
	to: TransactionPortfolio;
	from: TransactionPortfolio;
	currency: TransactionCurrency;
}

interface TransactionLocation {
	longitude: number;
	latitude: number;
}

type Transaction =
	| EarningTransaction
	| ExpenseTransaction
	| TransferTransaction;

export type {
	Transaction,
	EarningTransaction,
	ExpenseTransaction,
	TransferTransaction,
	TransactionLocation,
};

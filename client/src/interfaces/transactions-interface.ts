interface TransactionPortfolio {
	_id: string;
	description: string;
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
}

interface TransactionLocation {
	longitude: number;
	latitude: number;
}

interface BaseTransaction {
	_id: string;
	amount: number;
	amountInDefault: number;
	type: {
		_id: string;
		type: string;
	};
	date: string;
	createdAt: string;
	description: string;
}

interface EarningTransaction extends BaseTransaction {
	source: SourceOrCategory;
	currency: TransactionCurrency;
	portfolio: TransactionPortfolio;
}

interface ExpenseTransaction extends BaseTransaction {
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

// import { any } from "./transactions-interface";

interface PortfolioInterface {
	_id: string;
	name: string;
	amount: number;
	currency: string;
	type: string;
	favorite: boolean;
	deleted: boolean;
	color: string;
}

interface PortfolioDetailsInterface {
	_id: string;
	last: ForTypesDateInterface;
	currency: string;
	averages: ForTypesInterface;
	counts: ForTypesInterface;
	cvc?: string;
	bank?: string;
	cardNo?: string;
	validity?: string;
	cardHolder?: string;
	// TODO: Replace any
	topSources: Array<any>;
	topCategories: Array<any>;
	transactions: Array<any>;
}

interface ForTypesInterface {
	earnings: number;
	expenses: number;
}

interface ForTypesDateInterface {
	earnings: string;
	expenses: string;
}

interface PortfolioColors {
	first: string;
	second: string;
	third: string;
	fourth: string;
}

interface PortfolioAmounts {
	amount: number;
	amountInDefault: number;
	currency: {
		_id: string;
		name: string;
		symbol: string;
		acronym: string;
	};
}
interface NormalPortfolio {
	amounts: Array<PortfolioAmounts>;
	_id: string;
	createdAt: string;
	description: string;
	type: PortfolioType;
	color: "red" | "blue" | "gray" | "orange" | "green";
}

interface VirtualPortfolio extends NormalPortfolio {
	cvc: string;
	validity: string;
	cardNumber: string;
	bank: { _id: string; type: string };
}

type Portfolio = NormalPortfolio | VirtualPortfolio;

interface PortfolioType {
	_id: string;
	type: string;
}

export type {
	PortfolioInterface,
	PortfolioColors,
	PortfolioDetailsInterface,
	ForTypesDateInterface,
	ForTypesInterface,
	NormalPortfolio,
	VirtualPortfolio,
	PortfolioType,
	Portfolio,
};

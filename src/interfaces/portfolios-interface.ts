import { TransactionInterface } from "./transactions-interface";

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
  lastUsed: string;
  currency: string;
  avgAmountSpent: number;
  avgAmountEarned: number;
  transactionCount: number;
  cvc?: string;
  bank?: string;
  cardNo?: string;
  validity?: string;
  cardHolder?: string;
  transactions: Array<TransactionInterface>;
}

interface PortfolioColors {
  first: string;
  second: string;
  third: string;
  fourth: string;
}

export type { PortfolioInterface, PortfolioColors, PortfolioDetailsInterface };

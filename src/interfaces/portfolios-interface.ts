interface PortfolioInterface {
  _id: string;
  name: string;
  amount: number;
  currency: string;
  type: string;
  favorite: boolean;
  lastUsed: string;
  deleted: boolean;
  avgAmountSpent: number;
  avgAmountEarned: number;
  transactionCount: number;
  color: string;

  cvc?: string;
  bank?: string;
  cardNo?: string;
  validity?: string;
  cardHolder?: string;
}

interface PortfolioColors {
  first: string;
  second: string;
  third: string;
  fourth: string;
}

export type { PortfolioInterface, PortfolioColors };

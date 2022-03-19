// enum TransactionTypes {
//   INCOME = "income",
//   EXPENSE = "expense",
//   INVESTMENT = "investment",
// }

interface TransactionInterface {
  _id: string;
  date: string;
  type: string;
  title: string;
  amount: number;
  currency: string;
  source?: string;
  category?: string;
  portfolio: string;
  location?: Location;
  description: string;
  currencyRate: number;
}

interface Location {
  longitude: number;
  latitude: number;
}

export default TransactionInterface;

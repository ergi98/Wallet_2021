// Interfaces
import { Typography } from "@mui/material";
// import { TransactionInterface } from "../../../interfaces/transactions-interface";

interface PropsInterface {
  transactions: Array<any>;
}

function PortfolioTransactions(props: PropsInterface) {
  return (
    <div className="bg-neutral-50 p-3 rounded-lg text-slate-900 h-full">
      <Typography variant="h6">Transactions</Typography>
    </div>
  );
}

export default PortfolioTransactions;

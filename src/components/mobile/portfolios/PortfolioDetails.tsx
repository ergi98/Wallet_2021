import { useEffect, useState } from "react";

// MUI
import { Stack, Grid, Divider, Typography } from "@mui/material";

// Interfaces
import { PortfolioDetailsInterface } from "../../../interfaces/portfolios-interface";

// Utilities
import { formatDate } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
  id: string;
}

const portfolios: Array<PortfolioDetailsInterface> = [
  {
    _id: "6023423j4kl32j4kl32j4",
    currency: "ALL",
    lastUsed: new Date().toISOString(),
    avgAmountEarned: 250,
    avgAmountSpent: 23412.12,
    transactionCount: 10,
    transactions: [],
  },
  {
    _id: "6023423j4kl32j4kl32j5",
    currency: "ALL",
    lastUsed: new Date().toISOString(),
    avgAmountEarned: 20,
    avgAmountSpent: 232.12,
    transactionCount: 1,
    cvc: "123",
    bank: "Raiffeisen Bank",
    cardNo: "5674364736271623",
    validity: "12/22",
    transactions: [],
  },
];

function PortfolioDetails(props: PropsInterface) {
  const [details, setDetails] = useState<PortfolioDetailsInterface>();

  useEffect(() => {
    let portfolio = portfolios.find((portfolio) => portfolio._id === props.id);
    setDetails(portfolio);
  }, [props.id]);

  return (
    <div className="bg-red-50 p-3 rounded-lg text-slate-900">
      {details && (
        <Grid className="text-sm" container>
          <Grid className=" text-slate-500" xs={12} item>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
          </Grid>
          <Grid className=" text-slate-500" xs={7} item>
            No. of Transaction
          </Grid>
          <Grid className="text-right" xs={5} item>
            {details.transactionCount}
          </Grid>
          <Grid className=" text-slate-500" xs={7} item>
            Last Transaction
          </Grid>
          <Grid className="text-right" xs={5} item>
            {formatDate(details.lastUsed, "long")}
          </Grid>
          <Grid className="py-2" xs={12} item>
            <Divider></Divider>
          </Grid>
          <Grid className=" text-slate-500" xs={7} item>
            Avg. Income Transaction
          </Grid>
          <Grid className="text-right" xs={5} item>
            <AmountDisplay
              amount={details.avgAmountEarned}
              currency={details.currency}
              wholeClass="text-sm"
              decimalClass="text-xs"
            />
          </Grid>
          <Grid className=" text-slate-500" xs={7} item>
            Avg. Expense Transaction
          </Grid>
          <Grid className="text-right" xs={5} item>
            <AmountDisplay
              amount={-1 * details.avgAmountSpent}
              currency={details.currency}
              wholeClass="text-sm"
              decimalClass="text-xs"
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default PortfolioDetails;

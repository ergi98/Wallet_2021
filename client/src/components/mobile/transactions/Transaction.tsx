import { useState } from "react";

// Interfaces
import { TransactionInterface } from "../../../interfaces/transactions-interface";

// MUI
import { Grid, Stack, Typography } from "@mui/material";

// Utilities
import { getTimeFromDateString } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
  onClick: (a: boolean, b: TransactionInterface | null) => void;
  transaction: TransactionInterface;
}

function Transaction(props: PropsInterface) {
  const [time] = useState(() =>
    getTimeFromDateString(props.transaction.date)
  );

  return (
    <Grid
      container
      onClick={() => props.onClick(true, props.transaction)}
      className="w-full bg-neutral-50 p-2 rounded-lg rounded-b-none h-fit overflow-hidden border-b border-neutral-200"
    >
      <Grid xs={8} item>
        <Stack className="h-full" justifyContent="space-between" rowGap={1.25}>
          <div>
            {/** Title */}
            <div className="text-slate-900 text-ellipsis overflow-hidden whitespace-nowrap w-full">
              {time && (
                <span className="text-sm">{time}&nbsp;&minus;&nbsp;</span>
              )}
              <Typography component="span" variant="subtitle2">
                {props.transaction.title}
              </Typography>
            </div>
          </div>
          <div className="justify-self-end">
            <Stack direction="row" gap={0.75}>
              {/* Transaction Type */}
              <div
                className={`text-[8px] uppercase border-[1px] w-fit px-1 rounded-lg ${props.transaction.type}`}
              >
                {props.transaction.type}
              </div>
              {/* Category */}
              <div className="text-[8px] text-gray-600 uppercase border-[1px] w-fit px-1 rounded-lg">
                {props.transaction.category || props.transaction.source}
              </div>
            </Stack>
          </div>
        </Stack>
      </Grid>
      <Grid alignSelf="center" xs={4} item>
        {/** Price */}
        <AmountDisplay
          amount={props.transaction.amount}
          wholeClass="text-icon"
          decimalClass="text-icon text-xs"
          className="truncate self-center ml-auto w-fit text-slate-900"
        />
      </Grid>
    </Grid>
  );
}

export default Transaction;

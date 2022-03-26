// MUI
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// Interfaces
import {
  PortfolioColors,
  PortfolioInterface,
} from "../../../interfaces/portfolios-interface";
import { determinePortfolioColor } from "../../../utilities/portfolio-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
  portfolio: PortfolioInterface;
  onClick: (a: string) => void;
}

function Portfolio(props: PropsInterface) {
  const [colorSet, setColorSet] = useState<PortfolioColors | undefined>();

  useEffect(() => {
    let colors = determinePortfolioColor(props.portfolio.color);
    console.log(colors);
    setColorSet(colors);
  }, []);

  return (
    <>
      {colorSet && (
        <div className="relative rounded-xl mx-3 shadow-md text-neutral-50 min-h-[175px] overflow-hidden">
          <div
            className={`${colorSet.first} bg-gradient-to-br absolute inset-0 h-full w-full `}
            style={{ clipPath: "circle(150% at 0 0)" }}
          />
          <div
            className={`${colorSet.second} bg-gradient-to-br absolute inset-0 h-full w-full`}
            style={{ clipPath: "circle(110% at 0 0)" }}
          />
          <div
            className={`${colorSet.third} bg-gradient-to-br absolute inset-0 h-full w-full`}
            style={{ clipPath: "circle(80% at 0 0)" }}
          />
          <div
            className={`${colorSet.fourth} bg-gradient-to-br absolute inset-0 h-full w-full`}
            style={{ clipPath: "circle(50% at 0 0)" }}
          />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 via-neutral-300 to-neutral-800 opacity-10" />
          <Stack className="relative px-3 py-2 z-10 h-full">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>{props.portfolio.name}</Typography>
              <AmountDisplay
                amount={props.portfolio.amount}
                currency={props.portfolio.currency}
                wholeClass="text-xl"
                decimalClass="text-md"
              />
            </Stack>
            <div className="mt-auto">
              <Typography className="uppercase" variant="subtitle2">
                {props.portfolio.type}
              </Typography>
            </div>
          </Stack>
        </div>
      )}
    </>
  );
}

{
  /* <Grid className="text-sm pt-3" container>
          <Grid className=" text-slate-500" xs={6} item>
            No. of Transaction
          </Grid>
          <Grid className="text-right" xs={6} item>
            {props.portfolio.transactionCount}
          </Grid>
          <Grid className=" text-slate-500" xs={6} item>
            Avg. Income Transaction
          </Grid>
          <Grid className="text-right" xs={6} item>
            <AmountDisplay
              amount={props.portfolio.avgAmountEarned}
              currency={props.portfolio.currency}
              wholeClass="text-sm"
              decimalClass="text-xs"
            />
          </Grid>
          <Grid className=" text-slate-500" xs={6} item>
            Avg. Expense Transaction
          </Grid>
          <Grid className="text-right" xs={6} item>
            <AmountDisplay
              amount={-1 * props.portfolio.avgAmountSpent}
              currency={props.portfolio.currency}
              wholeClass="text-sm"
              decimalClass="text-xs"
            />
          </Grid>
          <Grid className=" text-slate-500" xs={6} item>
            Last Transaction
          </Grid>
          <Grid className="text-right" xs={6} item>
            {formatDate(props.portfolio.lastUsed, "long")}
          </Grid>
        </Grid> */
}

export default Portfolio;

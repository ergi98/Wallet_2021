// MUI
import { Typography, Grid, Divider } from "@mui/material";

// Interfaces
import {
  PortfolioDetailsInterface,
  ForTypesInterface,
  ForTypesDateInterface,
} from "../../../interfaces/portfolios-interface";

// Utilities
import { formatDate } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
  details: PortfolioDetailsInterface;
  type: keyof ForTypesInterface | keyof ForTypesDateInterface;
}

function PortfolioStatisticsFields(props: PropsInterface) {
  const singular = props.type.substring(0, props.type.length - 1);
  return (
    <Grid className="text-sm" container>
      <Grid className="text-slate-700 pb-5" xs={12} item>
        <Typography className="capitalize" variant="subtitle2">
          {props.type}
        </Typography>
      </Grid>
      <Grid className=" text-slate-500" xs={7} item>
        No.&nbsp;
        <span className="capitalize">{props.type}</span>
      </Grid>
      <Grid className="text-right" xs={5} item>
        {props.details.counts[props.type]}
      </Grid>
      <Grid className=" text-slate-500" xs={7} item>
        Last&nbsp;
        <span className=" capitalize">{singular}</span>
      </Grid>
      <Grid className="text-right" xs={5} item>
        {formatDate(props.details.last[props.type], "long")}
      </Grid>
      <Grid className="py-2" xs={12} item>
        <Divider></Divider>
      </Grid>
      <Grid className=" text-slate-500" xs={7} item>
        Avg.&nbsp;
        <span className=" capitalize">{singular}</span>
      </Grid>
      <Grid className="text-right" xs={5} item>
        <AmountDisplay
          amount={props.details.averages[props.type]}
          currency={props.details.currency}
          wholeClass="text-sm"
          decimalClass="text-xs"
        />
      </Grid>
    </Grid>
  );
}

export default PortfolioStatisticsFields;

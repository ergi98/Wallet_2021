// MUI
import { Stack, Typography } from "@mui/material";

// Utilities
import { isTodayDate } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
  date: string;
  label: String;
  amount: number;
  percent: number;
}

function HomeTitle(props: PropsInterface) {
  return (
    <div className="bg-neutral-50 rounded-xl mx-3 mb-6 pt-2 shadow-md">
      <Stack className="px-3">
        <div>
          <Typography className="text-blue-900" variant="subtitle1">
            {isTodayDate(props.date)
              ? `Today's ${props.label}`
              : `${props.label}`}
          </Typography>
        </div>
        <AmountDisplay
          amount={props.amount}
          className="self-center pt-4 text-slate-900"
        />
        <AmountDisplay
          amount={props.percent}
          suffix={"%"}
          wholeClass="text-sm"
          decimalClass="text-xs"
          className="self-center text-slate-900 pb-4"
        />
      </Stack>
    </div>
  );
}

export default HomeTitle;

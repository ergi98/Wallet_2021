// MUI
import { IconButton, Stack, Typography } from "@mui/material";

// Icons
import { RiEqualizerLine, RiArrowLeftRightLine } from "react-icons/ri";

// Utilities
import { formatDate, isTodayDate } from "../../../utilities/date-utilities";

interface PropsInterface {
  date: string;
  label: String;
  swapClick: () => void;
  changeDate: (a: string) => void;
}

function HomeTitle(props: PropsInterface) {
  function openDateFilter() {}

  return (
    <Stack className="px-3 pt-3">
      <Stack direction="row" justifyContent="space-between" className="pb-6">
        <IconButton onClick={openDateFilter} sx={{ fontSize: "20px" }}>
          <RiEqualizerLine className="text-neutral-50" />
        </IconButton>
        <IconButton onClick={() => props.swapClick()} sx={{ fontSize: "20px" }}>
          <RiArrowLeftRightLine className="text-neutral-50" />
        </IconButton>
      </Stack>
      <div>
        <Typography className="text-neutral-50" variant="subtitle1">
          {isTodayDate(props.date)
            ? `Today's ${props.label}`
            : `${props.label}`}
        </Typography>
      </div>
    </Stack>
  );
}

export default HomeTitle;

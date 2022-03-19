// MUI
import { Button, IconButton, Stack, Typography } from "@mui/material";

// Icons
import { SwapHorizOutlined } from "@mui/icons-material";

// Utilities
import { formatDate, isTodayDate } from "../../utilities/date-utilities";

interface PropsInterface {
  date: string;
  label: String;
  swapClick: () => void;
  changeDate: (a: string) => void;
}

function HomeTitle(props: PropsInterface) {
  function openDatePicker() {}

  return (
    <Stack className="px-3 pt-1" direction="row" justifyContent="space-between">
      <div>
        <Typography className="text-gray-100" variant="h6">
          {isTodayDate(props.date)
            ? `Today's ${props.label}`
            : `${props.label}`}
        </Typography>
        <Stack className="cursor-pointer" direction="row" gap={1}>
          <Button
            onClick={openDatePicker}
            sx={{ textTransform: "none", padding: 0, fontSize: "16px" }}
            size="small"
          >
            <Typography className="text-gray-100" variant="subtitle1">
              {formatDate(props.date)}
            </Typography>
          </Button>
        </Stack>
      </div>
      <div>
        <IconButton onClick={() => props.swapClick()}>
          <SwapHorizOutlined className="text-gray-100" />
        </IconButton>
      </div>
    </Stack>
  );
}

export default HomeTitle;

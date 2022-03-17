import { useState } from "react";

// MUI
import { IconButton, Stack, Typography, Button } from "@mui/material";

// Date fns
import { isToday } from "date-fns";

// Utilities
import { formatDate } from "../../utilities/date-utilities";

// Icons
import { SwapHorizOutlined } from "@mui/icons-material";

// Navigate
import { useNavigate } from "react-router-dom";

function HomeEarnings() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const navigate = useNavigate();

  const goToExpenses = () => navigate("/home/expenses");

  return (
    <Stack className="p-3" direction="row" justifyContent="space-between">
      <div>
        <Typography className="text-gray-100" variant="h6">
          {isToday(selectedDate) ? `Today's Earnings` : `Earnings`}
        </Typography>
        <Stack className="cursor-pointer" direction="row" gap={1}>
          <Button
            sx={{ textTransform: "none", padding: 0, fontSize: "16px" }}
            size="small"
          >
            <Typography className="text-gray-100" variant="subtitle1">
              {formatDate(selectedDate)}
            </Typography>
          </Button>
        </Stack>
      </div>
      <div>
        <IconButton onClick={goToExpenses}>
          <SwapHorizOutlined className="text-gray-100" />
        </IconButton>
      </div>
    </Stack>
  );
}

export default HomeEarnings;

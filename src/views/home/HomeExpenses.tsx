import { useState } from "react";

// MUI
import { IconButton, Stack, Typography, Button } from "@mui/material";

// Date fns
import { isToday } from "date-fns";

// Utilities
import { formatDate } from "../../utilities/date-utilities";

// Icons
import { SwapHorizOutlined } from "@mui/icons-material";

// Navigation
import { useNavigate } from "react-router-dom";

function HomeExpenses() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const navigate = useNavigate();

  const goToEarnings = () => navigate("/home/earnings");

  return (
    <Stack className="p-3" direction="row" justifyContent="space-between">
      <div>
        <Typography className="text-gray-100" variant="h6">
          {isToday(selectedDate) ? `Today's Expenses` : `Expenses`}
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
        <IconButton onClick={goToEarnings}>
          <SwapHorizOutlined className="text-gray-100" />
        </IconButton>
      </div>
    </Stack>
  );
}

export default HomeExpenses;

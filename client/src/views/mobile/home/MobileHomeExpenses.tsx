import { useState } from "react";

// MUI
import { Stack } from "@mui/material";

// Navigation
import { useNavigate } from "react-router-dom";

// Components
import Home from "../../../components/mobile/home/MobileHome";
import HomeTitle from "../../../components/mobile/home/MobileHomeTitle";
import HomeTopActions from "../../../components/mobile/home/MobileHomeTopActions";

function HomeExpenses() {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString()
  );

  const navigate = useNavigate();

  const goToEarnings = () => navigate("/home/earnings");

  return (
    <Home>
      <Stack>
        <HomeTopActions
          date={selectedDate}
          swapClick={goToEarnings}
          changeDate={(event) => setSelectedDate(event)}
        />
        <HomeTitle
          label="Expenses"
          date={selectedDate}
          amount={18023.23}
          percent={2.34}
        />
      </Stack>
    </Home>
  );
}

export default HomeExpenses;

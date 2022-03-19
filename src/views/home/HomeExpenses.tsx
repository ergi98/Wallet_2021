import { useState } from "react";

// MUI
import { Stack } from "@mui/material";

// Navigation
import { useNavigate } from "react-router-dom";

// Components
import Home from "../../components/home/Home";
import HomeTitle from "../../components/home/HomeTitle";
import AmountDisplay from "../../components/general/AmountDisplay";

function HomeExpenses() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const navigate = useNavigate();

  const goToEarnings = () => navigate("/home/earnings");

  return (
    <Home>
      <Stack>
        <HomeTitle
          label="Expenses"
          date={selectedDate}
          swapClick={goToEarnings}
          changeDate={(event) => setSelectedDate(event)}
        />
        <AmountDisplay
          amount={134000.35}
          className="self-center py-4 text-gray-300"
        />
      </Stack>
    </Home>
  );
}

export default HomeExpenses;

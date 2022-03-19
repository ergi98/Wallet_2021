import { useState } from "react";

// MUI
import { Stack } from "@mui/material";

// Navigate
import { useNavigate } from "react-router-dom";

// Components
import Home from "../../components/home/Home";
import HomeTitle from "../../components/home/HomeTitle";
import AmountDisplay from "../../components/general/AmountDisplay";

function HomeEarnings() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const navigate = useNavigate();

  const goToExpenses = () => navigate("/home/expenses");

  return (
    <Home>
      <Stack>
        <HomeTitle
          label="Earnings"
          date={selectedDate}
          swapClick={goToExpenses}
          changeDate={(event) => setSelectedDate(event)}
        />
        <AmountDisplay
          amount={25000.35}
          className="self-center py-4 text-gray-300"
        />
      </Stack>
    </Home>
  );
}

export default HomeEarnings;

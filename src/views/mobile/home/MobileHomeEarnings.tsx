import { useState } from "react";

// MUI
import { Stack } from "@mui/material";

// Navigate
import { useNavigate } from "react-router-dom";

// Components
import Home from "../../../components/mobile/home/MobileHome";
import HomeTitle from "../../../components/mobile/home/HomeTitle";
import HomeTopActions from "../../../components/mobile/home/HomeTopActions";

function HomeEarnings() {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString()
  );

  const navigate = useNavigate();

  const goToExpenses = () => navigate("/home/expenses");

  return (
    <Home>
      <Stack>
        <HomeTopActions
          date={selectedDate}
          swapClick={goToExpenses}
          changeDate={(event) => setSelectedDate(event)}
        />
        <HomeTitle
          label="Earnings"
          date={selectedDate}
          amount={18023.23}
          percent={2.34}
        />
      </Stack>
    </Home>
  );
}

export default HomeEarnings;

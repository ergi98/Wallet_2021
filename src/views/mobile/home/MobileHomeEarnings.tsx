import { useState } from "react";

// MUI
import { Stack } from "@mui/material";

// Navigate
import { useNavigate } from "react-router-dom";

// Components
import Home from "../../../components/mobile/home/MobileHome";
import HomeTitle from "../../../components/mobile/home/HomeTitle";
import AmountDisplay from "../../../components/general/AmountDisplay";

function HomeEarnings() {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString()
  );

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
          className="self-center pt-4 text-gray-300"
        />
        <AmountDisplay
          amount={2.5}
          suffix={"%"}
          wholeClass="text-sm"
          decimalClass="text-xs"
          className="self-center text-gray-300 pb-4"
        />
      </Stack>
    </Home>
  );
}

export default HomeEarnings;

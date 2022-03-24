import { ReactNode } from "react";

// Icons
import { RiAddFill } from "react-icons/ri";

// MUI
import { Button, IconButton, Stack, Typography } from "@mui/material";

// Navigation
import { useNavigate } from "react-router-dom";

// Components
import TransactionsList from "../transactions/TransactionsList";

interface PropsInterface {
  children: ReactNode;
}

const transaction = [
  // Expense
  {
    _id: "5f7f2fd6323a3b0017e1ec1d",
    date: new Date().toISOString(),
    type: "expense",
    title: "Kafe tek Moncheriaaa aaaaaaaaaaa aaaa  a aaaaaaaaaa aaaaaaa",
    amount: 2000,
    currency: "ALL",
    portfolio: "5f8351f9d4d24d00172cd7bc",
    location: {
      longitude: 19.834378436425062,
      latitude: 41.33407116183822,
    },
    currencyRate: 1,
    category: "Entertainment",
    description: "Ika per kafe te moncheria te shtunen ne mgjes.",
  },
  // Income
  {
    _id: "5f7f2fd6323a3b0017e1ec1e",
    date: new Date().toISOString(),
    type: "income",
    title: "Rroga ESDP",
    amount: 1563000,
    currency: "ALL",
    portfolio: "5f8351f9d4d24d00172cd7bd",
    description: "Kalimi i rroges nga ESDP",
    currencyRate: 1,
    source: "Job",
  },
  {
    _id: "5f7f2fd6323a3b0017e1ec1f",
    date: new Date().toISOString(),
    type: "expense",
    title: "Kafe tek Moncheria",
    amount: 2000,
    currency: "ALL",
    portfolio: "5f8351f9d4d24d00172cd7bc",
    location: {
      longitude: 19.834378436425062,
      latitude: 41.33407116183822,
    },
    currencyRate: 1,
    category: "Entertainment",
    description: "Ika per kafe te moncheria te shtunen ne mgjes.",
  },
  {
    _id: "5f7f2fd6323a3b0017e1ec31f",
    date: new Date().toISOString(),
    type: "expense",
    title: "Kafe tek Moncheria",
    amount: 2000,
    currency: "ALL",
    portfolio: "5f8351f9d4d24d00172cd7bc",
    location: {
      longitude: 19.834378436425062,
      latitude: 41.33407116183822,
    },
    currencyRate: 1,
    category: "Entertainment",
    description: "Ika per kafe te moncheria te shtunen ne mgjes.",
  },
  {
    _id: "5f7f2fd6323a3b0017e1ec11f",
    date: new Date().toISOString(),
    type: "expense",
    title: "Kafe tek Moncheria",
    amount: 2000,
    currency: "ALL",
    portfolio: "5f8351f9d4d24d00172cd7bc",
    location: {
      longitude: 19.834378436425062,
      latitude: 41.33407116183822,
    },
    currencyRate: 1,
    category: "Entertainment",
    description: "Ika per kafe te moncheria te shtunen ne mgjes.",
  },
  // Income
  {
    _id: "5f7f2fd6323a3b0017e1ecze",
    date: new Date().toISOString(),
    type: "income",
    title: "Lek nga te shpis",
    amount: 13000,
    currency: "ALL",
    portfolio: "5f8351f9d4d24d00172cd7bd",
    description: "Kalimi i rroges nga ESDP",
    currencyRate: 1,
    source: "Job",
  },
];

function Home(props: PropsInterface) {
  const navigate = useNavigate();
  const goTo = (url: string) => navigate(url);

  return (
    <div className="app-height relative overflow-x-hidden overflow-y-auto">
      {props.children}
      <div className="px-3">
        {/* <Stack className="pb-3" direction="row" gap={2}>
          <Button
            sx={{
              borderRadius: "25px",
              background: "white",
              border: "none",
              color: "gray",
            }}
            className="shadow-sm"
            startIcon={<RemoveOutlined />}
            onClick={() => goTo("/expense")}
            variant="outlined"
            fullWidth
          >
            Expense
          </Button>
          <Button
            sx={{ borderRadius: "25px" }}
            startIcon={<AddOutlined />}
            onClick={() => goTo("/income")}
            variant="contained"
            fullWidth
          >
            Income
          </Button>
        </Stack> */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="text-neutral-50 pb-3"
        >
          <Typography variant="subtitle1">Today's Transactions</Typography>
          <Button startIcon={<RiAddFill />} variant="text" color="inherit">
            New
          </Button>
        </Stack>
        <TransactionsList transactions={transaction} />
      </div>
    </div>
  );
}

export default Home;

import { Stack, Typography } from "@mui/material";

// Components
import PortfolioSettings from "../../../components/shared/settings/PortfolioSettings";
import TransactionsSettings from "../../../components/shared/settings/TransactionsSettings";
import CategoryAndSourcesSettings from "../../../components/shared/settings/CategoryAndSourcesSettings";

function MobileSettings() {
  return (
    <div className="p-3">
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Settings
      </Typography>
      <Stack className="pt-6">
        <div className="bg-neutral-50 rounded-xl mb-6 px-3 py-2 shadow-md">
          <CategoryAndSourcesSettings />
        </div>
        <div className="bg-neutral-50 rounded-xl mb-6 pt-2 shadow-md">
          <TransactionsSettings />
        </div>
        <div className="bg-neutral-50 rounded-xl mb-6 pt-2 shadow-md">
          <PortfolioSettings />
        </div>
      </Stack>
    </div>
  );
}

export default MobileSettings;

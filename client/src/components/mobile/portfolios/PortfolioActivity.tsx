// MUI
import { Typography } from "@mui/material";

function PortfolioActivity() {
  return (
    <div className="bg-neutral-50 p-3 rounded-lg text-slate-900 h-full">
      <Typography variant="h6">Activity</Typography>
      {/* Chart */}
      <div className="mt-3 w-full h-64 bg-neutral-400 rounded-lg"> Chart</div>
    </div>
  );
}

export default PortfolioActivity;

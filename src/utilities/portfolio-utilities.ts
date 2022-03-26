// Interfaces
import { PortfolioColors } from "../interfaces/portfolios-interface";

function determinePortfolioColor(color: string): PortfolioColors {
  let colors = {
    first: `from-${color}-800 to-${color}-900`,
    second: `from-${color}-700 to-${color}-800`,
    third: `from-${color}-600 to-${color}-700`,
    fourth: `from-${color}-500 to-${color}-600`,
  };
  return colors;
}

export { determinePortfolioColor };

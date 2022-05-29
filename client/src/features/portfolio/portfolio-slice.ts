import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces
import {
	Portfolio,
	PortfolioType,
} from "../../interfaces/portfolios-interface";

interface PortfolioState {
	portfolioTypes: Array<PortfolioType>;
	portfolios: Array<Portfolio>;
	loading: boolean;
	error: string;
}

const initialState: PortfolioState = {
	error: "",
	loading: false,
	portfolios: [],
	portfolioTypes: [],
};

const PortfolioSlice = createSlice({
	name: "portfolio",
	initialState,
	reducers: {
		setPortfolios: (state, action: PayloadAction<Array<Portfolio>>) => {
			state.portfolios = action.payload;
		},
		setPortfolioTypes: (state, action: PayloadAction<Array<PortfolioType>>) => {
			state.portfolioTypes = action.payload;
		},
	},
});

export default PortfolioSlice.reducer;
export const { setPortfolios, setPortfolioTypes } = PortfolioSlice.actions;

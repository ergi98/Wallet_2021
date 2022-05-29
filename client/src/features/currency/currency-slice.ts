import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces
import { Currency } from "../../interfaces/currency-interface";

interface CurrencyState {
	currencies: Array<Currency>;
	loading: boolean;
	error: string;
}

const initialState: CurrencyState = {
	error: "",
	loading: false,
	currencies: [],
};

const CurrencySlice = createSlice({
	name: "currency",
	initialState,
	reducers: {
		setCurrencies: (state, action: PayloadAction<Array<Currency>>) => {
			state.currencies = action.payload;
		},
	},
});

export default CurrencySlice.reducer;
export const { setCurrencies } = CurrencySlice.actions;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces
import { Bank } from "../../interfaces/bank-interface";

interface BankState {
	banks: Array<Bank>;
	loading: boolean;
	error: string;
}

const initialState: BankState = {
	error: "",
	loading: false,
	banks: [],
};

const BankSlice = createSlice({
	name: "bank",
	initialState,
	reducers: {
		setBanks: (state, action: PayloadAction<Array<Bank>>) => {
			state.banks = action.payload;
		},
	},
});

export default BankSlice.reducer;
export const { setBanks } = BankSlice.actions;

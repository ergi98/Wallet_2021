import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces
import { Source } from "../../interfaces/source-interface";

interface SourceState {
	sources: Array<Source>;
	loading: boolean;
	error: string;
}

const initialState: SourceState = {
	error: "",
	sources: [],
	loading: false,
};

const SourceSlice = createSlice({
	name: "source",
	initialState,
	reducers: {
		setSources: (state, action: PayloadAction<Array<Source>>) => {
			state.sources = action.payload;
		},
	},
});

export default SourceSlice.reducer;
export const { setSources } = SourceSlice.actions;

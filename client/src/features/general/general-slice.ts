import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Axios } from "axios";

interface GeneralState {
	fetched: boolean;
	loading: boolean;
	error: string;
}

const initialState: GeneralState = {
	fetched: false,
	loading: false,
	error: "",
};

const GeneralSlice = createSlice({
	name: "general",
	initialState,
	reducers: {
		setFetched: (state, action: PayloadAction<boolean>) => {
			state.fetched = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchNecessaryData.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchNecessaryData.fulfilled, (state) => {
			state.error = "";
			state.fetched = true;
			state.loading = false;
		});
		builder.addCase(fetchNecessaryData.rejected, (state, action) => {
			state.error =
				(action.payload as string) ||
				"An error occurred while fetching necessary data.";
			state.loading = false;
			state.fetched = false;
		});
	},
});

export const fetchNecessaryData = createAsyncThunk(
	"general/fetchNecessaryData",
	async (axios: Axios, { rejectWithValue }) => {
		try {
			const result = await axios.get("user/necessary-info");
			return result.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export default GeneralSlice.reducer;
export const { setFetched } = GeneralSlice.actions;

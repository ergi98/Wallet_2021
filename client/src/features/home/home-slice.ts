import { Axios } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux_store/store";

interface ApiData {
	previous: {
		earning: { amount: number };
		expense: { amount: number };
		transfer: { amount: number };
	};
	today: {
		earning: { amount: number; percent: number };
		expense: { amount: number; percent: number };
		transfer: { amount: number; percent: number };
	};
	expenseChart: Array<{
		_id: string;
		amount: number;
	}>;
}
interface HomeState extends ApiData {
	date: string;
	path: string;
	scroll: number;
	loading: boolean;
	error: string;
}

const initialState: HomeState = {
	scroll: 0,
	loading: false,
	error: "",
	expenseChart: [],
	path: "expenses",
	date: new Date().toISOString(),
	previous: {
		earning: { amount: 0 },
		expense: { amount: 0 },
		transfer: { amount: 0 },
	},
	today: {
		earning: { amount: 0, percent: 0 },
		expense: { amount: 0, percent: 0 },
		transfer: { amount: 0, percent: 0 },
	},
};

const HomeSlice = createSlice({
	name: "home",
	initialState,
	reducers: {
		setScroll: (state, action: PayloadAction<number>) => {
			state.scroll = action.payload;
		},
		setDate: (state, action: PayloadAction<string>) => {
			state.date = action.payload;
		},
		setPath: (state, action: PayloadAction<string>) => {
			state.path = action.payload;
		},
		setHomeData: (state, action: PayloadAction<ApiData>) => {
			state.today = action.payload.today;
			state.previous = action.payload.previous;
			state.expenseChart = action.payload.expenseChart;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchHomeData.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchHomeData.fulfilled, (state, action) => {
			state.error = "";
			state.loading = false;
			state.today = action.payload.today;
			state.previous = action.payload.previous;
			state.expenseChart = action.payload.expenseChart;
		});
	},
});

export const fetchHomeData = createAsyncThunk(
	"home/fetchHomeData",
	async (axiosInstance: Axios, { getState }) => {
		const state = getState() as RootState;
		try {
			const date = new Date(state.home.date);
			const result = await axiosInstance.get("transaction/home-statistics", {
				params: {
					start: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
					end: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
				},
			});
			return result.data;
		} catch (err) {
			console.log(err);
		}
	}
);

export default HomeSlice.reducer;
export const { setScroll, setDate, setPath, setHomeData } = HomeSlice.actions;

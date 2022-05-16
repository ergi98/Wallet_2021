import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: HomeState = {
	scroll: 0,
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
});

export default HomeSlice.reducer;
export const { setScroll, setDate, setPath, setHomeData } = HomeSlice.actions;

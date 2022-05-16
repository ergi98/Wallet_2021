import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	scroll: 0,
	date: new Date(),
	path: "/expenses",
};

const HomeSlice = createSlice({
	name: "home",
	initialState,
	reducers: {
		setScroll: (state, action) => {
			state.scroll = action.payload;
		},
		setDate: (state, action) => {
			state.date = action.payload;
		},
		setPath: (state, action) => {
			state.path = action.payload;
		},
	},
});

export default HomeSlice.reducer;
export const { setScroll, setDate, setPath } = HomeSlice.actions;

import { configureStore } from "@reduxjs/toolkit";

// Reducers
import HomeReducer from "../features/home/home-slice";

const store = configureStore({
	reducer: {
		home: HomeReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

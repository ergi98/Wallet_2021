import { configureStore } from "@reduxjs/toolkit";

// Reducers
import HomeReducer from "../features/home/home-slice";
import UserReducer from "../features/user/user-slice";
import AuthReducer from "../features/auth/auth-slice";
import TransactionReducer from "../features/transactions/transaction-slice";

const store = configureStore({
	reducer: {
		auth: AuthReducer,
		home: HomeReducer,
		user: UserReducer,
		transaction: TransactionReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";

// Reducers
import HomeReducer from "../features/home/home-slice";
import UserReducer from "../features/user/user-slice";
import AuthReducer from "../features/auth/auth-slice";
import BankReducer from "../features/bank/bank-slice";
import SourceReducer from "../features/source/source-slice";
import GeneralReducer from "../features/general/general-slice";
import CurrencyReducer from "../features/currency/currency-slice";
import CategoryReducer from "../features/category/category-slice";
import PortfolioReducer from "../features/portfolio/portfolio-slice";
import TransactionReducer from "../features/transactions/transaction-slice";

const store = configureStore({
	reducer: {
		auth: AuthReducer,
		home: HomeReducer,
		user: UserReducer,
		bank: BankReducer,
		source: SourceReducer,
		general: GeneralReducer,
		currency: CurrencyReducer,
		category: CategoryReducer,
		portfolio: PortfolioReducer,
		transaction: TransactionReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

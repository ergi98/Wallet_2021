import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Axios } from "axios";
import { Transaction } from "../../interfaces/transactions-interface";

interface TransactionState {
	last?: {
		value?: string;
		date?: string;
	};
	error: string;
	loading: boolean;
	filters: Filters;
	transactions: Array<Transaction>;
}

interface Filters {
	description?: string;
	types?: Array<string>;
	sources?: Array<string>;
	categories?: Array<string>;
	currencies?: Array<string>;
	portfolios?: Array<string>;
	dateRange?: {
		from: string;
		to: string;
	};
	amountRange?: {
		from: string;
		to: string;
	};
	sortBy?: "date" | "amount";
	direction?: "asc" | "dsc";
}

const initialState: TransactionState = {
	error: "",
	filters: {},
	loading: false,
	transactions: [],
};

const TransactionSlice = createSlice({
	name: "transaction",
	initialState,
	reducers: {
		setTransactions: (state, action: PayloadAction<Array<Transaction>>) => {
			state.transactions = action.payload;
		},
		pushTransactions: (state, action: PayloadAction<Array<Transaction>>) => {
			state.transactions.push(...action.payload);
		},
		setFilters: (state, action: PayloadAction<Filters>) => {
			state.filters = action.payload;
		},
		resetFilters: (state) => {
			state.filters = {};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchTransactions.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchTransactions.fulfilled, (state, action) => {
			state.error = "";
			state.loading = false;
			state.last = action.payload.last;
			state.transactions = action.payload.transactions;
		});
		builder.addCase(fetchTransactions.rejected, (state, error) => {
			state.error = "An error occurred while fetching data.";
			state.loading = false;
		});
	},
});

export const fetchTransactions = createAsyncThunk(
	"transaction/fetchTransactions",
	async (args: { axios: Axios; filters: Filters }) => {
		try {
			const result = await args.axios.get("transaction/get-all", {
				params: args.filters,
			});
			return result.data;
		} catch (err) {
			console.log(err);
		}
	}
);

export default TransactionSlice.reducer;
export const { pushTransactions, setTransactions, setFilters, resetFilters } =
	TransactionSlice.actions;

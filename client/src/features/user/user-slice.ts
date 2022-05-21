import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Axios } from "axios";

interface UserState {
	user: User | null;
	loading: boolean;
	error: string;
	fetched: boolean;
}

interface User {
	_id: string;
	username: string;
	personal: {
		name: string;
		surname: string;
		gender?: string;
		birthday?: string;
		employer?: string;
		profession?: string;
	};
	defaultCurrency: {
		_id: string;
		name: string;
		symbol: string;
		acronym: string;
	};
}

const initialState: UserState = {
	user: null,
	error: "",
	loading: false,
	// Wether the info has already been fetched
	fetched: false,
};

const UserSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchUser.fulfilled, (state, action) => {
			state.error = "";
			state.loading = false;
			state.fetched = true;
			state.user = action.payload.user;
		});
		builder.addCase(fetchUser.rejected, (state, error) => {
			state.error = "An error occurred while fetching data.";
			state.loading = false;
		});
	},
});

export const fetchUser = createAsyncThunk(
	"user/fetchUser",
	async (axios: Axios) => {
		try {
			const result = await axios.get("user/info");
			console.log(result);
			return result.data;
		} catch (err) {
			console.log(err);
		}
	}
);

export default UserSlice.reducer;
export const { setUser } = UserSlice.actions;

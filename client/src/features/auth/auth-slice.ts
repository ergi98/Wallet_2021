import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Axios } from "axios";

interface AuthState {
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string;
}

const initialState: AuthState = {
	token: null,
	isAuthenticated: false,

	error: "",
	loading: false,
};

const AuthSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setToken: (state, action: PayloadAction<string | null>) => {
			state.token = action.payload;
			state.isAuthenticated = Boolean(action.payload);
		},
	},
	extraReducers: (builder) => {
		// User Login
		builder.addCase(loginUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(loginUser.fulfilled, (state, action) => {
			state.error = "";
			state.loading = false;
			state.token = action.payload.token;
			state.isAuthenticated = Boolean(action.payload.token);
		});
		builder.addCase(loginUser.rejected, (state, action) => {
			state.error =
				(action.payload as string) || "An error occurred while logging in.";
			state.loading = false;
		});
		// Token Refresh
		builder.addCase(refreshToken.fulfilled, (state, action) => {
			state.error = "";
			state.token = action.payload.token;
			state.isAuthenticated = Boolean(action.payload.token);
		});
		builder.addCase(refreshToken.rejected, (state, action) => {
			state.error =
				(action.payload as string) ||
				"An error occurred while refreshing token.";
			state.loading = false;
		});
		// Sign up User
		builder.addCase(signUpUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(signUpUser.fulfilled, (state, action) => {
			state.error = "";
			state.loading = false;
			state.token = action.payload.token;
			state.isAuthenticated = Boolean(action.payload.token);
		});
		builder.addCase(signUpUser.rejected, (state, action) => {
			state.error =
				(action.payload as string) || "An error occurred while signing up.";
			state.loading = false;
		});
		// Logout
		builder.addCase(logoutUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(logoutUser.fulfilled, (state) => {
			state.error = "";
			state.loading = false;
			state.token = null;
			state.isAuthenticated = false;
		});
		builder.addCase(logoutUser.rejected, (state, action) => {
			state.error =
				(action.payload as string) || "An error occurred while logging out.";
			state.loading = false;
		});
	},
});

export const loginUser = createAsyncThunk(
	"auth/logIn",
	async (
		args: {
			axios: Axios;
			data: { username: string; password: string };
		},
		{ rejectWithValue }
	) => {
		try {
			const result = await args.axios.post("auth/log-in", args.data);
			return result.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const logoutUser = createAsyncThunk(
	"auth/logOut",
	async (axios: Axios, { rejectWithValue }) => {
		try {
			const result = await axios.post("auth/log-out");
			return result.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const signUpUser = createAsyncThunk(
	"auth/signUp",
	async (args: { axios: Axios; data: any }, { rejectWithValue }) => {
		try {
			const result = await args.axios.post("auth/sign-up", args.data);
			return result.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const refreshToken = createAsyncThunk(
	"auth/refreshToken",
	async (axios: Axios, { rejectWithValue }) => {
		try {
			const result = await axios.get("auth/refresh-token", {
				withCredentials: true,
			});
			return result.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export default AuthSlice.reducer;
export const { setToken } = AuthSlice.actions;

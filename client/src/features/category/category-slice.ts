import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces
import { Category } from "../../interfaces/category-interface";

interface CategoryState {
	categories: Array<Category>;
	loading: boolean;
	error: string;
}

const initialState: CategoryState = {
	error: "",
	loading: false,
	categories: [],
};

const CategorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<Array<Category>>) => {
			state.categories = action.payload;
		},
	},
});

export default CategorySlice.reducer;
export const { setCategories } = CategorySlice.actions;

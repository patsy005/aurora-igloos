import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    discounts: [],
    error: "",
    status: "idle",
    isFetching: false,
    isCreating: false,
    isEditing: false,
}

export const fetchDiscounts = createAsyncThunk("discounts/fetchDiscounts", async () => {
    const res = await fetch("http://localhost:5212/api/Discounts");
    const data = await res.json();
    console.log(data);
    return data;
});

const discountsSlice = createSlice({
    name: "discounts",
    initialState,
	reducers: {
		setIsCreating: (state, action) => {
            state.isCreating = action.payload
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload
        },
	},
    extraReducers: builder => {
        builder
            .addCase(fetchDiscounts.fulfilled, (state, action) => {
                state.discounts = action.payload;
                state.status = "idle";
                state.isFetching = false;
            })
            .addCase(fetchDiscounts.pending, state => {
                state.status = "loading";
                state.isFetching = true;
            })
            .addCase(fetchDiscounts.rejected, (state, action) => {
                state.status = "error";
                state.error = action.error.message;
                state.isFetching = false;
            });
    }
})

export const { setIsCreating, setIsEditing } = discountsSlice.actions;
export default discountsSlice.reducer;
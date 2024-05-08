import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	promotions: [],
	error: '',
	status: 'idle',
	isFetching: false,
	isCreating: false,
    isEditing: false,
}

export const fetchPromo = createAsyncThunk('igloos/fetchPromo', async () => {
	const res = await fetch('/data.json')
	const data = await res.json()
	return data.igloos
})

const promoSlice = createSlice({
	name: 'promo',
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
			.addCase(fetchPromo.fulfilled, (state, action) => {
				state.promotions = action.payload
				state.status = 'idle'
				state.isFetching = false
			})
			.addCase(fetchPromo.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchPromo.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
	},
})

export const { setIsCreating, setIsEditing} = promoSlice.actions
export default promoSlice.reducer

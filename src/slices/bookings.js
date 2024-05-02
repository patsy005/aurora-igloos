import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	bookings: [],
	error: '',
	status: 'idle',
	isFetching: false,
    isCreating: false,
    isEditing: false,
}

export const fetchBookings = createAsyncThunk('igloos/fetchIgloos', async () => {
	const res = await fetch('/data.json')
	const data = await res.json()
	return data.igloos
})

const bookingsSlice = createSlice({
	name: 'bookings',
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
			.addCase(fetchBookings.fulfilled, (state, action) => {
				state.bookings = action.payload
				state.status = 'idle'
				state.isFetching = false
			})
			.addCase(fetchBookings.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchBookings.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
	},
})

export const {setIsCreating, setIsEditing} = bookingsSlice.actions
export default bookingsSlice.reducer

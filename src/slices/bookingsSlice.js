import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	bookings: [],
	error: '',
	status: 'idle',
	isFetching: false,
    isCreating: false,
    isEditing: false,
}

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
	const res = await fetch('http://localhost:5212/api/Bookings')
	const data = await res.json()
	return data
})

export const addNewBooking = createAsyncThunk('bookings/addNewBooking', async (newBooking, { rejectWithValue }) => {
	const res = await fetch('http://localhost:5212/api/Bookings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newBooking),
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to add new booking' })
	}
	
	const data = await res.json()
	return data
})

export const editBooking = createAsyncThunk(
	'bookings/editBooking',
	async ({ id, updatedBooking }, { rejectWithValue }) => {
		const res = await fetch(`http://localhost:5212/api/Bookings/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedBooking),
		})

		if (!res.ok) {
			throw rejectWithValue({ message: 'Failed to edit booking' })
		}

		if (res.status == 204) {
			return { id }
		}

		const data = await res.json()
		return data
	}
)

export const deleteBooking = createAsyncThunk('bookings/deleteBooking', async (id, { rejectWithValue }) => {
	const res = await fetch(`http://localhost:5212/api/Bookings/${id}`, {
		method: 'DELETE',
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to delete booking' })
	}

	if (res.status == 204) {
		return { id }
	}

	const data = await res.json()
	return data
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
				// state.isFetching = true
			})
			.addCase(fetchBookings.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
			.addCase(addNewBooking.fulfilled, (state, action) => {
				state.bookings.push(action.payload)
				state.isCreating = false
				state.error = ''
			})
			.addCase(addNewBooking.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(addNewBooking.pending, state => {
				state.isFetching = true
			})
			.addCase(editBooking.fulfilled, (state, action) => {
				state.isFetching = false
				state.isEditing = false
				state.error = ''
			})
			.addCase(editBooking.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(editBooking.pending, state => {
				state.isFetching = true
			})
			.addCase(deleteBooking.fulfilled, (state, action) => {
				state.bookings = state.bookings.filter(booking => booking.id !== action.payload.id)
				state.error = ''
				state.isFetching = false
			})
			.addCase(deleteBooking.rejected, (state, action) => {
				state.error = action.payload.message
				state.isFetching = false
			})
			.addCase(deleteBooking.pending, state => {
				state.isFetching = true
			})
	},
})

export const {setIsCreating, setIsEditing} = bookingsSlice.actions
export default bookingsSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'

const initialState = {
	bookings: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (_, { getState, rejectWithValue }) => {
	try {
		const token = getState().auth.accessToken
		const res = await fetch('http://localhost:5212/api/Bookings', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!res.ok) {
			const error = await res.text()
			return rejectWithValue(error.message || 'Failed to fetch bookings')
		}

		const data = await res.json()
		return data
	} catch (e) {
		return rejectWithValue(e.message)
	}
})

export const addNewBooking = createAsyncThunk(
	'bookings/addNewBooking',
	async (newBooking, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch('http://localhost:5212/api/Bookings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newBooking),
		})

		if (!res.ok) {
			throw rejectWithValue({ message: 'Failed to add new booking' })
		}

		const data = await res.json()
		return data
	}
)

export const editBooking = createAsyncThunk(
	'bookings/editBooking',
	async ({ id, updatedBooking }, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch(`http://localhost:5212/api/Bookings/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
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

export const deleteBooking = createAsyncThunk('bookings/deleteBooking', async (id, { getState, rejectWithValue }) => {
	const token = getState().auth.accessToken
	const res = await fetch(`http://localhost:5212/api/Bookings/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
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

export const fetchCustomerBookings = createAsyncThunk(
	'bookings/fetchCustomerBookings',
	async (_, { getState, rejectWithValue }) => {
		try {
			const token = getState().auth.accessToken
			if (!token) return rejectWithValue('No token')

			const res = await fetch('http://localhost:5212/api/Bookings/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!res.ok) {
				const msg = await res.text()
				return rejectWithValue(msg || 'Failed to fetch customer bookings')
			}

			return await res.json()
		} catch (e) {
			return rejectWithValue(e.message || 'Network error')
		}
	}
)

const bookingsSlice = createSlice({
	name: 'bookings',
	initialState,
	reducers: {},
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
			.addCase(addNewBooking.fulfilled, (state, action) => {
				state.bookings.push(action.payload)
				state.fetch = false
				state.error = ''
			})
			.addCase(addNewBooking.rejected, (state, action) => {
				state.error = action.payload.message
				state.isFetching = false
			})
			.addCase(addNewBooking.pending, state => {
				state.isFetching = true
			})
			.addCase(editBooking.fulfilled, (state, action) => {
				state.isFetching = false
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
			.addCase(fetchCustomerBookings.fulfilled, (state, action) => {
				state.bookings = action.payload
				state.status = 'idle'
				state.isFetching = false
			})
			.addCase(fetchCustomerBookings.pending, state => {
				state.status = 'loading'
				// state.isFetching = true
			})
			.addCase(fetchCustomerBookings.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
			.addCase(logout, state => {
				state.bookings = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
			})
	},
})

export default bookingsSlice.reducer

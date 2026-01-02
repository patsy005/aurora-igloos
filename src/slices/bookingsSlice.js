import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	bookings: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (_, thunkApi) => {
	return await apiFetch('/Bookings', {}, thunkApi)
})

export const addNewBooking = createAsyncThunk('bookings/addNewBooking', async (newBooking, thunkApi) => {
	return await apiFetch(
		'/Bookings',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newBooking),
		},
		thunkApi
	)
})

export const editBooking = createAsyncThunk('bookings/editBooking', async ({ id, updatedBooking }, thunkApi) => {
	const result = await apiFetch(
		`/Bookings/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedBooking),
		},
		thunkApi
	)
	return result ?? { id, ...updatedBooking }
})

export const deleteBooking = createAsyncThunk('bookings/deleteBooking', async (id, thunkApi) => {
	const result = await apiFetch(
		`/Bookings/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
	return result ?? { id }
})

export const fetchCustomerBookings = createAsyncThunk('bookings/fetchCustomerBookings', async (_, thunkApi) => {
	// try {
	// 	const token = getState().auth.accessToken
	// 	if (!token) return rejectWithValue('No token')

	// 	const res = await fetch('http://localhost:5212/api/Bookings/me', {
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	})

	// 	if (!res.ok) {
	// 		const msg = await res.text()
	// 		return rejectWithValue(msg || 'Failed to fetch customer bookings')
	// 	}

	// 	return await res.json()
	// } catch (e) {
	// 	return rejectWithValue(e.message || 'Network error')
	// }
	return await apiFetch('/Bookings/me', {}, thunkApi)
})

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

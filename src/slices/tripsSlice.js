import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	trips: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
	const res = await fetch('http://localhost:5212/api/Trip')
	const data = await res.json()
	console.log(data)
	return data
})

export const addNewTrip = createAsyncThunk('trips/addNewTrip', async (newTrip, thunkApi) => {
	return await apiFetch(
		'/Trip',
		{
			method: 'POST',
			body: newTrip,
		},
		thunkApi
	)
})

export const editTrip = createAsyncThunk('trips/editTrip', async ({ id, updatedTrip }, thunkApi) => {
	const result = await apiFetch(
		`/Trip/${id}`,
		{
			method: 'PUT',
			body: updatedTrip,
		},
		thunkApi
	)

	//  JEŚLI backend zwrócił 204 → sami składamy payload
	return result ?? { id }
})

export const deleteTrip = createAsyncThunk('trips/deleteTrip', async (id, thunkApi) => {
	const result = await apiFetch(
		`/Trip/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)

	//  JEŚLI backend zwrócił 204 → sami składamy payload
	return result ?? id
})

const tripsSlice = createSlice({
	name: 'trips',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTrips.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchTrips.fulfilled, (state, action) => {
				state.status = 'idle'
				state.trips = action.payload
				state.isFetching = false
			})
			.addCase(fetchTrips.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
			.addCase(addNewTrip.fulfilled, (state, action) => {
				state.trips.push(action.payload)
				state.isFetching = false
				state.status = 'idle'
				state.error = ''
			})
			.addCase(addNewTrip.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(addNewTrip.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(editTrip.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'idle'
				state.error = ''
			})
			.addCase(editTrip.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(editTrip.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(deleteTrip.fulfilled, (state, action) => {
				state.trips = state.trips.filter(trip => trip.id !== action.payload)
				state.isFetching = false
				state.status = 'idle'
				state.error = ''
			})
			.addCase(deleteTrip.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(deleteTrip.pending, state => {
				state.isFetching = true
			})
			.addCase(logout, state => {
				state.trips = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
			})
	},
})

export default tripsSlice.reducer

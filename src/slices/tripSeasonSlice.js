import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	tripSeasons: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchTripSeasons = createAsyncThunk('tripSeasons/fetchTripSeasons', async () => {
	const res = await fetch('http://localhost:5212/api/TripSeason')
	const data = await res.json()
	return data
})

export const addNewTripSeason = createAsyncThunk('tripSeasons/addNewTripSeason', async (newTripSeason, thunkApi) => {
	return await apiFetch(
		'/TripSeason',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newTripSeason),
		},
		thunkApi
	)
})

export const editTripSeason = createAsyncThunk(
	'tripSeasons/editTripSeason',
	async ({ id, updatedTripSeason }, thunkApi) => {
		const result = await apiFetch(
			`/TripSeason/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedTripSeason),
			},
			thunkApi
		)

		//  JEŚLI backend zwrócił 204 → sami składamy payload
		return result ?? { id, ...updatedTripSeason }
	}
)

export const deleteTripSeason = createAsyncThunk('tripSeasons/deleteTripSeason', async (id, thunkApi) => {
	const result = await apiFetch(
		`/TripSeason/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)

	//  JEŚLI backend zwrócił 204 → sami składamy payload
	return result ?? id
})

const tripSeasonSlice = createSlice({
	name: 'tripSeasons',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTripSeasons.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(fetchTripSeasons.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.tripSeasons = action.payload
				state.error = ''
			})
			.addCase(fetchTripSeasons.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(addNewTripSeason.fulfilled, (state, action) => {
				state.tripSeasons.push(action.payload)
				state.isFetching = false
				state.status = 'succeeded'
				state.error = ''
			})
			.addCase(addNewTripSeason.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(editTripSeason.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.error = ''
			})
			.addCase(editTripSeason.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(editTripSeason.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(deleteTripSeason.fulfilled, (state, action) => {
				state.tripSeasons = state.tripSeasons.filter(tripSeason => tripSeason.id !== action.payload)
				state.isFetching = false
				state.status = 'succeeded'
				state.error = ''
			})
			.addCase(deleteTripSeason.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(deleteTripSeason.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(logout, state => {
				state.tripSeasons = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
			})
	},
})

export default tripSeasonSlice.reducer

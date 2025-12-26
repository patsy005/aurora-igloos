import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	trips: [],
	error: '',
	status: 'idle',
	isFetching: false,
	isCreating: false,
	isEditing: false,
}

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
	const res = await fetch('http://localhost:5212/api/Trip')
	const data = await res.json()
	console.log(data)
	return data
})

export const addNewTrip = createAsyncThunk('trips/addNewTrip', async (newTrip, { rejectWithValue }) => {
	const res = await fetch('http://localhost:5212/api/Trip', {
		method: 'POST',
		// headers: {
		// 	'Content-Type': 'application/json',
		// },
		// body: JSON.stringify(newTrip),
		body: newTrip,
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to add new trip' })
	}

	const data = await res.json()
	return data
})

export const editTrip = createAsyncThunk('trips/editTrip', async ({ id, updatedTrip }, { rejectWithValue }) => {
	try {
		const res = await fetch(`http://localhost:5212/api/Trip/${id}`, {
			method: 'PUT',
			// headers: {
			// 	'Content-Type': 'application/json',
			// },
			// body: JSON.stringify(updatedTrip),
			body: updatedTrip,
		})

		if (!res.ok) {
			const errorBody = await res.json().catch(() => null)
			console.error('Error response body:', errorBody)
			return rejectWithValue(errorBody || { message: 'Failed to edit trip' })
		}

		// 204 NoContent – nie próbujemy parsować JSON-a
		return { id }
	} catch (err) {
		return rejectWithValue(err.message)
	}
})

export const deleteTrip = createAsyncThunk('trips/deleteTrip', async (id, { rejectWithValue }) => {
	const res = await fetch(`http://localhost:5212/api/Trip/${id}`, {
		method: 'DELETE',
	})

	if (!res.ok) {
		return rejectWithValue('Failed to delete trip')
	}

	return id
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
				state.isCreating = false
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
				state.isEditing = false
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
	},
})

export default tripsSlice.reducer

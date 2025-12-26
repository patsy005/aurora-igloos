import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	tripLevels: [],
	error: '',
	status: 'idle',
	isFetching: false,
	isCreating: false,
	isEditing: false,
}

export const fetchTripLevel = createAsyncThunk('tripLevel/fetchTripLevel', async () => {
    const res = await fetch('http://localhost:5212/api/TripLevel')
    const data = await res.json()
    return data
})

export const addNewTripLevel = createAsyncThunk('tripLevel/addNewTripLevel', async (newTripLevel, { rejectWithValue }) => {
    const res = await fetch('http://localhost:5212/api/TripLevel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTripLevel),
    })

    if (!res.ok) {
        return rejectWithValue('Failed to add new trip level')
    }

    const data = await res.json()
    return data
})

export const editTripLevel = createAsyncThunk('tripLevel/editTripLevel', async ({ id, updatedTripLevel }, { rejectWithValue }) => {
    const res = await fetch(`http://localhost:5212/api/TripLevel/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTripLevel),
    })

    if (!res.ok) {
        return rejectWithValue('Failed to edit trip level')
    }

    if (res.status == 204) {
        return { id, ...updatedTripLevel }
    }

    const data = await res.json()
    return data
})

export const deleteTripLevel = createAsyncThunk('tripLevel/deleteTripLevel', async (id, { rejectWithValue }) => {
    const res = await fetch(`http://localhost:5212/api/TripLevel/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        return rejectWithValue('Failed to delete trip level')
    }

    if (res.status == 204) {
        return { id }
    }

    const data = await res.json()
    return data
})

const tripLevelSlice = createSlice({
    name: 'tripLevel',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTripLevel.pending, state => {
                state.isFetching = true
                state.status = 'loading'
            })
            .addCase(fetchTripLevel.fulfilled, (state, action) => {
                state.isFetching = false
                state.status = 'succeeded'
                state.tripLevels = action.payload
                state.error = ''
            })
            .addCase(fetchTripLevel.rejected, (state, action) => {
                state.isFetching = false
                state.status = 'error'
                state.error = action.error.message
            })
            .addCase(addNewTripLevel.fulfilled, (state, action) => {
                state.tripLevels.push(action.payload)
                state.isFetching = false
                state.status = 'succeeded'
                state.error = ''
            })
            .addCase(addNewTripLevel.rejected, (state, action) => {
                state.isFetching = false
                state.status = 'error'
                state.error = action.payload
            })
            .addCase(addNewTripLevel.pending, state => {
                state.isFetching = true
                state.status = 'loading'
            })
            .addCase(editTripLevel.fulfilled, (state, action) => {
                state.isFetching = false
                state.status = 'succeeded'
                state.error = ''
            })
            .addCase(editTripLevel.rejected, (state, action) => {
                state.isFetching = false
                state.status = 'error'
                state.error = action.payload
            })
            .addCase(editTripLevel.pending, state => {
                state.isFetching = true
                state.status = 'loading'
            })
            .addCase(deleteTripLevel.fulfilled, (state, action) => {
                state.tripLevels = state.tripLevels.filter(tripLevel => tripLevel.id !== action.payload)
                state.isFetching = false
                state.status = 'succeeded'
                state.error = ''
            })
            .addCase(deleteTripLevel.rejected, (state, action) => {
                state.isFetching = false
                state.status = 'error'
                state.error = action.payload
            })
            .addCase(deleteTripLevel.pending, state => {
                state.isFetching = true
                state.status = 'loading'
            })
    },
})

export default tripLevelSlice.reducer
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	igloos: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchIgloos = createAsyncThunk('igloos/fetchIgloos', async () => {
	const res = await fetch('/data.json')
	const data = await res.json()
	return data.igloos
})

const igloosSlice = createSlice({
	name: 'igloos',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchIgloos.fulfilled, (state, action) => {
				state.igloos = action.payload
				state.status = 'idle'
				state.isFetching = false
			})
			.addCase(fetchIgloos.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchIgloos.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
	},
})

// export const { } = igloosSlice.actions
export default igloosSlice.reducer

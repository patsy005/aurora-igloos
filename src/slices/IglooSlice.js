import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	igloos: [],
	error: '',
	status: 'idle',
	isFetching: false,
	isCreating: false,
    isEditing: false,
}

export const fetchIgloos = createAsyncThunk('igloos/fetchIgloos', async () => {
	const res = await fetch('/data.json')
	const data = await res.json()
	return data.igloos
})

const igloosSlice = createSlice({
	name: 'igloos',
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

export const { setIsCreating, setIsEditing} = igloosSlice.actions
export default igloosSlice.reducer

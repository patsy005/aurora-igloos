import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	cuatomers: [],
	error: '',
	status: 'idle',
	isFetching: false,
	isCreating: false,
    isEditing: false,
}

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
	const res = await fetch('/data.json')
	const data = await res.json()
	return data.cuatomers
})

const customersSlice = createSlice({
	name: 'customers',
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
			.addCase(fetchCustomers.fulfilled, (state, action) => {
				state.cuatomers = action.payload
				state.status = 'idle'
				state.isFetching = false
			})
			.addCase(fetchCustomers.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchCustomers.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
	},
})

export const { setIsCreating, setIsEditing} = customersSlice.actions
export default customersSlice.reducer

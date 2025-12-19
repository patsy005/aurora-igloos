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
	const res = await fetch('http://localhost:5212/api/Igloos')
	const data = await res.json()
	return data
})

export const addNewIgloo = createAsyncThunk('igloos/addNewIgloo', async (newIgloo, { rejectWithValue }) => {
	const res = await fetch('http://localhost:5212/api/Igloos', {
		method: 'POST',
		// headers: {
		// 	'Content-Type': 'application/json',
		// },
		// body: JSON.stringify(newIgloo),
		// bo backend przyjmuje form data
		body: newIgloo,
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to add new igloo' })
	}

	const data = await res.json()
	return data
})

export const editIgloo = createAsyncThunk('igloos/editIgloo', async ({ id, updatedIgloo }, { rejectWithValue }) => {
	try {
		const res = await fetch(`http://localhost:5212/api/Igloos/${id}`, {
			method: 'PUT',
			body: updatedIgloo,
		})

		if (!res.ok) {
			const errorBody = await res.json().catch(() => null)
			console.error('Error response body:', errorBody)
			return rejectWithValue(errorBody || { message: 'Failed to edit igloo' })
		}

		// 204 NoContent – nie próbujemy parsować JSON-a
		return { id }
	} catch (err) {
		return rejectWithValue(err.message)
	}
})

export const deleteIgloo = createAsyncThunk('igloos/deleteIgloo', async (id, { rejectWithValue }) => {
	const res = await fetch(`http://localhost:5212/api/Igloos/${id}`, {
		method: 'DELETE',
	})

	if (!res.ok) {
		// throw rejectWithValue({ message: 'Failed to delete igloo' })
		try {
			const errorBody = await res.json()
			return rejectWithValue(errorBody.message)
		} catch {
			return rejectWithValue('Failed to delete igloo')
		}
	}

	return id
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
				state.error = ''
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

			.addCase(addNewIgloo.fulfilled, (state, action) => {
				state.igloos = [...state.igloos, action.payload]
				state.isCreating = false
				state.isFetching = false
				state.error = ''
			})
			.addCase(addNewIgloo.rejected, (state, action) => {
				state.error = action.payload.message
				state.isCreating = false
				state.isFetching = false
				state.error = action.payload.message
			})
			.addCase(addNewIgloo.pending, state => {
				state.isFetching = true
			})

			.addCase(editIgloo.pending, state => {
				state.isCreating = true
				state.isFetching = true
			})
			.addCase(editIgloo.fulfilled, (state, action) => {
				// const index = state.igloos.findIndex(igloo => igloo.id === action.payload.id)
				// state.igloos[index] = action.payload
				state.isCreating = false
				state.isFetching = false
				state.error = ''
			})
			.addCase(editIgloo.rejected, (state, action) => {
				state.error = action.payload.message
				state.isCreating = false
				state.isFetching = false
				state.error = action.payload.message
			})
			.addCase(deleteIgloo.fulfilled, (state, action) => {
				state.igloos = state.igloos.filter(igloo => igloo.id !== action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(deleteIgloo.rejected, (state, action) => {
				state.error = action.payload.message
				state.isFetching = false
			})
			.addCase(deleteIgloo.pending, state => {
				state.isFetching = true
			})
	},
})

export const { setIsCreating, setIsEditing } = igloosSlice.actions
export default igloosSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	igloos: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchIgloos = createAsyncThunk('igloos/fetchIgloos', async () => {
	const res = await fetch('http://localhost:5212/api/Igloos')
	const data = await res.json()
	return data
})

export const addNewIgloo = createAsyncThunk('igloos/addNewIgloo', async (newIgloo, thunkApi) => {
	return await apiFetch(
		'/Igloos',
		{
			method: 'POST',
			body: newIgloo,
		},
		thunkApi
	)
})

export const editIgloo = createAsyncThunk(
	'igloos/editIgloo',
	async ({ id, updatedIgloo }, thunkApi) => {
		const result = await apiFetch(
			`/Igloos/${id}`,
			{
				method: 'PUT',
				body: updatedIgloo,
			},
			thunkApi
		)

		//  JEŚLI backend zwrócił 204 → sami składamy payload
		return result ?? { id }
	}
)

export const deleteIgloo = createAsyncThunk('igloos/deleteIgloo', async (id, thunkApi) => {
	const result = await apiFetch(
		`/Igloos/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)

	//  JEŚLI backend zwrócił 204 → sami składamy payload
	return result ?? id
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
				state.isFetching = false
				state.error = ''
			})
			.addCase(addNewIgloo.rejected, (state, action) => {
				state.error = action.payload.message
				state.isFetching = false
				state.error = action.payload.message
			})
			.addCase(addNewIgloo.pending, state => {
				state.isFetching = true
			})

			.addCase(editIgloo.pending, state => {
				state.isFetching = true
			})
			.addCase(editIgloo.fulfilled, (state, action) => {
				// const index = state.igloos.findIndex(igloo => igloo.id === action.payload.id)
				// state.igloos[index] = action.payload
				state.isFetching = false
				state.error = ''
			})
			.addCase(editIgloo.rejected, (state, action) => {
				state.error = action.payload.message
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
			.addCase(logout, state => {
				state.igloos = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
			})
	},
})

export default igloosSlice.reducer

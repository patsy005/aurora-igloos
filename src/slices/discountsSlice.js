import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	discounts: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchDiscounts = createAsyncThunk('discounts/fetchDiscounts', async () => {
	const res = await fetch('http://localhost:5212/api/Discounts')
	const data = await res.json()
	return data
})

export const addNewDiscount = createAsyncThunk('discounts/addNewDiscount', async (newDiscount, thunkApi) => {
	return await apiFetch(
		'/Discounts',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newDiscount),
		},
		thunkApi
	)
})

export const editDiscount = createAsyncThunk('discounts/editDiscount', async ({ id, updatedDiscount }, thunkApi) => {
	const result = await apiFetch(
		`/Discounts/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedDiscount),
		},
		thunkApi
	)

	//  JEŚLI backend zwrócił 204 → sami składamy payload
	return result ?? { id, ...updatedDiscount }
})

export const deleteDiscount = createAsyncThunk('discounts/deleteDiscount', async (id, thunkApi) => {
	await apiFetch(`/Discounts/${id}`, { method: 'DELETE' }, thunkApi)
	return id
})

const discountsSlice = createSlice({
	name: 'discounts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchDiscounts.fulfilled, (state, action) => {
				state.discounts = action.payload
				state.status = 'idle'
				state.isFetching = false
			})
			.addCase(fetchDiscounts.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchDiscounts.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
			.addCase(addNewDiscount.fulfilled, (state, action) => {
				state.discounts.push(action.payload)
				state.isFetching = false
				state.status = 'idle'
				state.error = ''
			})
			.addCase(addNewDiscount.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(addNewDiscount.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(editDiscount.fulfilled, (state, action) => {
				const index = state.discounts.findIndex(discount => discount.id === action.payload.id)
				if (index !== -1) {
					state.discounts[index] = action.payload
				}
				state.isFetching = false
				state.status = 'idle'
				state.error = ''
			})
			.addCase(editDiscount.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(editDiscount.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(deleteDiscount.fulfilled, (state, action) => {
				state.discounts = state.discounts.filter(discount => discount.id !== action.payload)
				state.isFetching = false
				state.status = 'idle'
				state.error = ''
			})
			.addCase(deleteDiscount.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(deleteDiscount.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'error'
				state.error = action.payload
			})
			.addCase(logout, state => {
				state.discounts = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
			})
	},
})

export default discountsSlice.reducer

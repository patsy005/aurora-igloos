import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	items: [],
	isLoading: false,
	error: null,
}

export const fetchContentBlocks = createAsyncThunk('contentBlocks/fetchContentBlocks', async (_, thunkApi) => {
	return await apiFetch('/ContentBlocks', {}, thunkApi)
})

export const addNewContentBlock = createAsyncThunk(
	'contentBlocks/addNewContentBlock',
	async (newContentBlock, thunkApi) => {
		return await apiFetch(
			'/ContentBlocks',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newContentBlock),
			},
			thunkApi
		)
	}
)

export const editContentBlock = createAsyncThunk(
	'contentBlocks/editContentBlock',
	async ({ id, updatedContentBlock }, thunkApi) => {
		const result = await apiFetch(
			`/ContentBlocks/${id}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedContentBlock),
			},
			thunkApi
		)

		if (!result) {
			return { id, ...updatedContentBlock }
		}

		return result
	}
)

export const deleteContentBlock = createAsyncThunk('contentBlocks/deleteContentBlock', async (id, thunkApi) => {
	const result = await apiFetch(
		`/ContentBlocks/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
	return result ?? id
})

export const contentBlocksSlice = createSlice({
	name: 'contentBlocks',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchContentBlocks.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchContentBlocks.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = action.payload
			})
			.addCase(fetchContentBlocks.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.error.message
			})
			.addCase(addNewContentBlock.fulfilled, (state, action) => {
				state.items.push(action.payload)
			})
			.addCase(editContentBlock.fulfilled, (state, action) => {
				const index = state.items.findIndex(item => item.id === action.payload.id)
				if (index !== -1) {
					state.items[index] = action.payload
				}
			})
			.addCase(deleteContentBlock.fulfilled, (state, action) => {
				state.items = state.items.filter(item => item.id !== action.meta.arg)
			})
	},
})

export default contentBlocksSlice.reducer

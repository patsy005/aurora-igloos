import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	forumCategories: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchForumCategories = createAsyncThunk('forumCategories/fetchForumCategories', async (_, thunkApi) => {
	return await apiFetch('/ForumCategories', {}, thunkApi)
})

export const addNewForumCategory = createAsyncThunk(
	'forumCategories/addNewForumCategory',
	async (newForumCategory, thunkApi) => {
		return await apiFetch(
			'/ForumCategories',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newForumCategory),
			},
			thunkApi
		)
	}
)

export const editForumCategory = createAsyncThunk(
	'forumCategories/editForumCategory',
	async ({ id, updatedForumCategory }, thunkApi) => {
		const result = await apiFetch(
			`/ForumCategories/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedForumCategory),
			},
			thunkApi
		)
		return result ?? { id, ...updatedForumCategory }
	}
)

export const deleteForumCategory = createAsyncThunk('forumCategories/deleteForumCategory', async (id, thunkApi) => {
	const result = await apiFetch(
		`/ForumCategories/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
	return result ?? id
})

const forumCategorySlice = createSlice({
	name: 'forumCategories',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchForumCategories.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchForumCategories.fulfilled, (state, action) => {
				state.forumCategories = action.payload
				state.status = 'idle'
				state.isFetching = false
				state.error = ''
			})
			.addCase(fetchForumCategories.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
			.addCase(addNewForumCategory.fulfilled, (state, action) => {
				state.forumCategories.push(action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(addNewForumCategory.rejected, (state, action) => {
				state.error = action.payload
				state.isFetching = false
			})
			.addCase(addNewForumCategory.pending, state => {
				state.isFetching = true
			})
			.addCase(editForumCategory.pending, state => {
				state.isEditing = true
				state.isFetching = true
			})
			.addCase(editForumCategory.fulfilled, (state, action) => {
				const index = state.forumCategories.findIndex(category => category.id === action.payload.id)
				if (index !== -1) {
					state.forumCategories[index] = action.payload
				}
				state.isFetching = false
				state.error = ''
			})
			.addCase(editForumCategory.rejected, (state, action) => {
				state.error = action.payload
				state.isFetching = false
			})
			.addCase(deleteForumCategory.fulfilled, (state, action) => {
				state.forumCategories = state.forumCategories.filter(category => category.id !== action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(deleteForumCategory.rejected, (state, action) => {
				state.error = action.payload
				state.isFetching = false
			})
			.addCase(deleteForumCategory.pending, state => {
				state.isFetching = true
			})
	},
})

export default forumCategorySlice.reducer

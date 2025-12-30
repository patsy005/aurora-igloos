import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	forumPosts: [],
	error: '',
	isFetching: false,
}

export const fetchForumPosts = createAsyncThunk('forumPosts/fetchForumPosts', async (_, thunkApi) => {
	return await apiFetch('/ForumPosts', {}, thunkApi)
})

export const addNewForumPost = createAsyncThunk('forumPosts/addNewForumPost', async (newForumPost, thunkApi) => {
	return await apiFetch(
		'/ForumPosts',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newForumPost),
		},
		thunkApi
	)
})

export const editForumPost = createAsyncThunk(
	'forumPosts/editForumPost',
	async ({ id, updatedForumPost }, thunkApi) => {
		return await apiFetch(
			`/ForumPosts/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedForumPost),
			},
			thunkApi
		)
	}
)

export const deleteForumPost = createAsyncThunk('forumPosts/deleteForumPost', async (id, thunkApi) => {
	return await apiFetch(
		`/ForumPosts/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
})

const forumPostsSlice = createSlice({
	name: 'forumPosts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchForumPosts.pending, state => {
				state.isFetching = true
			})
			.addCase(fetchForumPosts.fulfilled, (state, action) => {
				state.isFetching = false
				state.forumPosts = action.payload
				state.error = ''
			})
			.addCase(fetchForumPosts.rejected, (state, action) => {
				state.isFetching = false
				state.error = action.error.message
			})
			.addCase(addNewForumPost.pending, state => {
				state.isFetching = true
			})
			.addCase(addNewForumPost.fulfilled, (state, action) => {
				state.isFetching = false
				state.forumPosts.push(action.payload)
				state.error = ''
			})
			.addCase(addNewForumPost.rejected, (state, action) => {
				state.isFetching = false
				state.error = action.payload
			})
			.addCase(editForumPost.pending, state => {
				state.isFetching = true
			})
			.addCase(editForumPost.fulfilled, (state, action) => {
				state.isFetching = false
				state.error = ''
			})
			.addCase(editForumPost.rejected, (state, action) => {
				state.isFetching = false
				state.error = action.payload
			})
			.addCase(deleteForumPost.fulfilled, (state, action) => {
				state.forumPosts = state.forumPosts.filter(post => post.id !== action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(deleteForumPost.rejected, (state, action) => {
				state.error = action.payload
				state.isFetching = false
			})
			.addCase(deleteForumPost.pending, state => {
				state.isFetching = true
			})
			.addCase(logout, state => {
				state.forumPosts = []
				state.error = ''
				state.isFetching = false
			})
	},
})

export default forumPostsSlice.reducer

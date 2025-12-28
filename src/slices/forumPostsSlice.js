import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'

const initialState = {
	forumPosts: [],
	error: '',
	isFetching: false,
}

export const fetchForumPosts = createAsyncThunk(
	'forumPosts/fetchForumPosts',
	async (_, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch('http://localhost:5212/api/ForumPosts', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		const data = await res.json()
		console.log(data)
		return data
	}
)

export const addNewForumPost = createAsyncThunk(
	'forumPosts/addNewForumPost',
	async (newForumPost, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch('http://localhost:5212/api/ForumPosts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newForumPost),
		})

		if (!res.ok) {
			return rejectWithValue('Failed to add new forum post')
		}

		const data = await res.json()
		return data
	}
)

export const editForumPost = createAsyncThunk(
	'forumPosts/editForumPost',
	async ({ id, updatedForumPost }, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch(`http://localhost:5212/api/ForumPosts/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updatedForumPost),
		})

		if (!res.ok) {
			return rejectWithValue('Failed to edit forum post')
		}

		if (res.status == 204) {
			return { id, ...updatedForumPost }
		}

		const data = await res.json()
		return data
	}
)

export const deleteForumPost = createAsyncThunk(
	'forumPosts/deleteForumPost',
	async (id, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch(`http://localhost:5212/api/ForumPosts/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!res.ok) {
			return rejectWithValue('Failed to delete forum post')
		}

		return id
	}
)

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

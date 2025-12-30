import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	forumComments: [],
	status: 'idle',
	isFetching: false,
	error: '',
}

export const fetchForumComments = createAsyncThunk('forumComments/fetchForumComments', async (_, thunkApi) => {
	return await apiFetch('/ForumComments', {}, thunkApi)
})

export const addNewForumComment = createAsyncThunk(
	'forumComments/addNewForumComment',
	async (newForumComment, thunkApi) => {
		return await apiFetch(
			'/ForumComments',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newForumComment),
			},
			thunkApi
		)
	}
)

export const editForumComment = createAsyncThunk(
	'forumComments/editForumComment',
	async ({ id, updatedForumComment }, thunkApi) => {
		const result = await apiFetch(
			`/ForumComments/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedForumComment),
			},
			thunkApi
		)
		return result ?? { id, ...updatedForumComment }
	}
)

export const deleteForumComment = createAsyncThunk('forumComments/deleteForumComment', async (id, thunkApi) => {
	const result = await apiFetch(
		`/ForumComments/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
	return result ?? id
})

const forumCommentSlice = createSlice({
	name: 'forumComments',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchForumComments.pending, state => {
				state.isFetching = true
				state.status = 'loading'
				state.error = ''
			})
			.addCase(fetchForumComments.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.forumComments = action.payload
			})
			.addCase(fetchForumComments.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(addNewForumComment.fulfilled, (state, action) => {
				state.forumComments.push(action.payload)
			})
			.addCase(addNewForumComment.rejected, (state, action) => {
				state.error = action.payload
			})
			.addCase(addNewForumComment.pending, state => {
				state.isFetching = true
			})
			.addCase(editForumComment.fulfilled, (state, action) => {
				const index = state.forumComments.findIndex(comment => comment.id === action.payload.id)
				if (index !== -1) {
					state.forumComments[index] = action.payload
				}
			})
			.addCase(editForumComment.rejected, (state, action) => {
				state.error = action.payload
			})
			.addCase(editForumComment.pending, state => {
				state.isFetching = true
			})
			.addCase(deleteForumComment.fulfilled, (state, action) => {
				state.forumComments = state.forumComments.filter(comment => comment.id !== action.payload)
			})
			.addCase(deleteForumComment.rejected, (state, action) => {
				state.error = action.payload
			})
			.addCase(deleteForumComment.pending, state => {
				state.isFetching = true
			})
	},
})
export default forumCommentSlice.reducer

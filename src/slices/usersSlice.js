import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	users: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkApi) => {
	return await apiFetch('/User', {}, thunkApi)
})

export const addNewUser = createAsyncThunk('users/addNewUser', async (newUser, thunkApi) => {
	return await apiFetch(
		'/User',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		},
		thunkApi
	)
})

export const editUser = createAsyncThunk('users/editUser', async ({ id, updatedUser }, thunkApi) => {
	const result = await apiFetch(
		`/User/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedUser),
		},
		thunkApi
	)
	return result ?? { id, ...updatedUser }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkApi) => {
	const result = await apiFetch(
		`/User/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
	return result ?? id
})

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUsers.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.users = action.payload
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(addNewUser.fulfilled, (state, action) => {
				state.users.push(action.payload)
			})
			.addCase(addNewUser.rejected, (state, action) => {
				state.error = action.payload
			})
			.addCase(addNewUser.pending, state => {
				state.isFetching = true
			})
			.addCase(editUser.fulfilled, (state, action) => {
				const index = state.users.findIndex(user => user.id === action.payload.id)
				if (index !== -1) {
					state.users[index] = action.payload
				}
			})
			.addCase(editUser.rejected, (state, action) => {
				state.error = action.payload
			})
			.addCase(editUser.pending, state => {
				state.isFetching = true
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				state.users = state.users.filter(user => user.id !== action.payload)
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.error = action.payload
			})
			.addCase(deleteUser.pending, state => {
				state.isFetching = true
			})
	},
})

export default usersSlice.reducer

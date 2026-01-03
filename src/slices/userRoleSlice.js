import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	userRoles: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchUserRoles = createAsyncThunk('userRoles/fetchUserRoles', async (_, thunkApi) => {
	return await apiFetch('/UserRole', {}, thunkApi)
})

export const addNewUserRole = createAsyncThunk('userRoles/addNewUserRole', async (newUserRole, thunkApi) => {
	return await apiFetch(
		'/UserRole',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUserRole),
		},
		thunkApi
	)
})

export const editUserRole = createAsyncThunk('userRoles/editUserRole', async ({ id, updatedUserRole }, thunkApi) => {
	const result = await apiFetch(
		`/UserRole/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedUserRole),
		},
		thunkApi
	)
	return result ?? { id, ...updatedUserRole }
})

export const deleteUserRole = createAsyncThunk('userRoles/deleteUserRole', async (id, thunkApi) => {
	const result = await apiFetch(
		`/UserRole/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
	return result ?? id
})

const userRoleSlice = createSlice({
	name: 'userRoles',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUserRoles.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(fetchUserRoles.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.userRoles = action.payload
				state.error = ''
			})
			.addCase(fetchUserRoles.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(addNewUserRole.pending, state => {
				state.isFetching = true
			})
			.addCase(addNewUserRole.fulfilled, (state, action) => {
				state.userRoles.push(action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(addNewUserRole.rejected, (state, action) => {
				state.error = action.payload || action.error.message
				state.isFetching = false
			})
			.addCase(editUserRole.pending, state => {
				state.isFetching = true
			})
			.addCase(editUserRole.fulfilled, (state, action) => {
				state.isFetching = false
				state.error = ''
			})
			.addCase(editUserRole.rejected, (state, action) => {
				state.error = action.payload || action.error.message
				state.isFetching = false
			})
			.addCase(deleteUserRole.pending, state => {
				state.isFetching = true
			})
			.addCase(deleteUserRole.fulfilled, (state, action) => {
				state.userRoles = state.userRoles.filter(userRole => userRole.id !== action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(deleteUserRole.rejected, (state, action) => {
				state.error = action.payload || action.error.message
				state.isFetching = false
			})
	},
})

export const { setIsCreating, setIsEditing } = userRoleSlice.actions
export default userRoleSlice.reducer

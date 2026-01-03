import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	userTypes: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchUserTypes = createAsyncThunk('userTypes/fetchUserTypes', async (_, thunkApi) => {
	return await apiFetch('/UserType', {}, thunkApi)
})

export const addNewUserType = createAsyncThunk('userTypes/addNewUserType', async (newUserType, thunkApi) => {
	return await apiFetch(
		'/UserType',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUserType),
		},
		thunkApi
	)
})

export const editUserType = createAsyncThunk('userTypes/editUserType', async ({ id, updatedUserType }, thunkApi) => {
	const result = await apiFetch(
		`/UserType/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedUserType),
		},
		thunkApi
	)
	return result ?? { id, ...updatedUserType }
})

export const deleteUserType = createAsyncThunk('userTypes/deleteUserType', async (id, thunkApi) => {
	const result = await apiFetch(
		`/UserType/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)
	return result ?? id
})

const userTypesSlice = createSlice({
	name: 'userTypes',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUserTypes.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(fetchUserTypes.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.userTypes = action.payload
				state.error = ''
			})
			.addCase(fetchUserTypes.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(addNewUserType.pending, state => {
				state.isFetching = true
			})
			.addCase(addNewUserType.fulfilled, (state, action) => {
				state.userTypes.push(action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(addNewUserType.rejected, (state, action) => {
				state.error = action.payload || action.error.message
				state.isFetching = false
			})
			.addCase(editUserType.pending, state => {
				state.isFetching = true
			})
			.addCase(editUserType.fulfilled, (state, action) => {
				const index = state.userTypes.findIndex(userType => userType.id === action.payload.id)
				if (index !== -1) {
					state.userTypes[index] = action.payload
				}
				state.isFetching = false
				state.error = ''
			})
			.addCase(editUserType.rejected, (state, action) => {
				state.error = action.payload || action.error.message
				state.isFetching = false
			})
			.addCase(deleteUserType.pending, state => {
				state.isFetching = true
			})
			.addCase(deleteUserType.fulfilled, (state, action) => {
				state.userTypes = state.userTypes.filter(userType => userType.id !== action.payload)
				state.isFetching = false
				state.error = ''
			})
			.addCase(deleteUserType.rejected, (state, action) => {
				state.error = action.payload || action.error.message
				state.isFetching = false
			})
	},
})

export default userTypesSlice.reducer

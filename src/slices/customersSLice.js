import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	customers: [],
	error: '',
	status: 'idle',
	isFetching: false,
	myProfile: null,
}

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, thunkApi) => {
	return await apiFetch('/Customers', {}, thunkApi)
})

export const addNewCustomer = createAsyncThunk('customers/addNewCustomer', async (newCustomer, thunkApi) => {
	return await apiFetch(
		'/Customers',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newCustomer),
		},
		thunkApi
	)
})

export const editCustomer = createAsyncThunk(
	'customers/editCustomer',
	async ({ id, updatedCustomer }, thunkApi) => {
		return await apiFetch(
			`/Customers/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedCustomer),
			},
			thunkApi
		)
	}
)

export const deleteCustomer = createAsyncThunk(
	'customers/deleteCustomer',
	async (id, thunkApi) => {
		return await apiFetch(
			`/Customers/${id}`,
			{
				method: 'DELETE',
			},
			thunkApi
		)
	}
)

export const getMyCustomerProfile = createAsyncThunk(
	'customers/getMyCustomerProfile',
	async (_, thunkApi) => {
		return await apiFetch('/Customers/my-profile', {}, thunkApi)
	}
)

const customersSlice = createSlice({
	name: 'customers',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCustomers.fulfilled, (state, action) => {
				state.customers = action.payload
				state.status = 'idle'
				state.isFetching = false
			})
			.addCase(fetchCustomers.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchCustomers.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
			.addCase(addNewCustomer.fulfilled, (state, action) => {
				state.customers.push(action.payload)
				state.isFetching
				state.error = ''
			})
			.addCase(addNewCustomer.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(addNewCustomer.pending, state => {
				state.isFetching = true
			})
			.addCase(editCustomer.fulfilled, (state, action) => {
				state.isFetching = false
				state.error = ''
			})
			.addCase(editCustomer.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(editCustomer.pending, state => {
				state.isFetching = true
			})
			.addCase(deleteCustomer.fulfilled, (state, action) => {
				state.customers = state.customers.filter(cust => cust.id !== action.payload)
			})
			.addCase(deleteCustomer.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(deleteCustomer.pending, state => {
				state.isFetching = true
			})
			.addCase(getMyCustomerProfile.fulfilled, (state, action) => {
				state.myProfile = action.payload
				state.isFetching = false
				state.error = ''
			})
			.addCase(getMyCustomerProfile.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(getMyCustomerProfile.pending, state => {
				state.isFetching = true
			})
			.addCase(logout, state => {
				state.myProfile = null
				state.customers = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
			})
	},
})

export default customersSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	customers: [],
	error: '',
	status: 'idle',
	isFetching: false,
	isCreating: false,
    isEditing: false,
}

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
	const res = await fetch('http://localhost:5212/api/Customers')
	const data = await res.json()
	return data
})

export const addNewCustomer = createAsyncThunk('customers/addNewCustomer', async (newCustomer, { rejectWithValue }) => {
	const res = await fetch('http://localhost:5212/api/Customers', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newCustomer),
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to add new customer' })
	}
	
	const data = await res.json()
	return data
})

export const editCustomer = createAsyncThunk(
	'customers/editCustomer',
	async ({ id, updatedCustomer }, { rejectWithValue }) => {
		const res = await fetch(`http://localhost:5212/api/Customers/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedCustomer),
		})

		if (!res.ok) {
			throw rejectWithValue({ message: 'Failed to edit customer' })
		}

		if (res.status == 204) {
			return { id }
		}

		const data = await res.json()
		return data
	}
)

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id, { rejectWithValue }) => {
	const res = await fetch(`http://localhost:5212/api/Customers/${id}`, {
		method: 'DELETE',
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to delete customer' })
	}

	return id
})

const customersSlice = createSlice({
	name: 'customers',
	initialState,
	reducers: {
		setIsCreating: (state, action) => {
            state.isCreating = action.payload
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload
        },
	},
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
				state.isCreating = false
				state.error = ''
			})
			.addCase(addNewCustomer.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(addNewCustomer.pending, state => {
				state.isFetching = true
			})
			.addCase(editCustomer.fulfilled, (state, action) => {
				state.isEditing = false
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
			
	},
})

export const { setIsCreating, setIsEditing} = customersSlice.actions
export default customersSlice.reducer

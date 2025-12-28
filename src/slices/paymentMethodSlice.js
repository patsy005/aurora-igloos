import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'

const initialState = {
	paymentMethods: [],
	error: '',
	status: 'idle',
	isFetching: false,
}

export const fetchPaymentMethods = createAsyncThunk('paymentMethods/fetchPaymentMethods', async () => {
	const res = await fetch('http://localhost:5212/api/PaymentMethods')
	const data = await res.json()
	return data
})

export const addNewPaymentMethod = createAsyncThunk(
	'paymentMethods/addNewPaymentMethod',
	async (newPaymentMethod, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch('http://localhost:5212/api/PaymentMethods', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newPaymentMethod),
		})

		if (!res.ok) {
			return rejectWithValue('Failed to add new payment method')
		}

		const data = await res.json()
		return data
	}
)

export const editPaymentMethod = createAsyncThunk(
	'paymentMethods/editPaymentMethod',
	async ({ id, updatedPaymentMethod }, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch(`http://localhost:5212/api/PaymentMethods/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updatedPaymentMethod),
		})

		if (!res.ok) {
			return rejectWithValue('Failed to edit payment method')
		}

		if (res.status == 204) {
			return { id, ...updatedPaymentMethod }
		}

		const data = await res.json()
		return data
	}
)

export const deletePaymentMethod = createAsyncThunk(
	'paymentMethods/deletePaymentMethod',
	async (id, { getState, rejectWithValue }) => {
		const token = getState().auth.accessToken
		const res = await fetch(`http://localhost:5212/api/PaymentMethods/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!res.ok) {
			return rejectWithValue('Failed to delete payment method')
		}

		return id
	}
)

const paymentMethodSlice = createSlice({
	name: 'paymentMethods',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPaymentMethods.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(fetchPaymentMethods.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.paymentMethods = action.payload
				state.error = ''
			})
			.addCase(fetchPaymentMethods.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(addNewPaymentMethod.fulfilled, (state, action) => {
				state.paymentMethods.push(action.payload)
				state.isFetching = false
				state.status = 'succeeded'
				state.error = ''
			})
			.addCase(addNewPaymentMethod.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(addNewPaymentMethod.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(editPaymentMethod.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.error = ''
			})
			.addCase(editPaymentMethod.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(editPaymentMethod.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(deletePaymentMethod.fulfilled, (state, action) => {
				state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload)
				state.isFetching = false
				state.status = 'succeeded'
				state.error = ''
			})
			.addCase(deletePaymentMethod.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(deletePaymentMethod.pending, state => {
				state.isFetching = true
				state.status = 'loading'
			})
			.addCase(logout, state => {
				state.paymentMethods = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
			})
	},
})

export default paymentMethodSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API = 'http://localhost:5212/api'

// reading JSON from localStorage
const loadJson = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key)
		if (!raw) return fallback
		return JSON.parse(raw)
	} catch {
		return fallback
	}
}

// saving state to localStorage
const persistAuth = (accessToken, user) => {
	if (accessToken) localStorage.setItem('accessToken', accessToken)
	else localStorage.removeItem('accessToken')

	if (user) localStorage.setItem('user', JSON.stringify(user))
	else localStorage.removeItem('user')
}

const initialState = {
	accessToken: localStorage.getItem('accessToken'),
	user: loadJson('user', null),
	status: 'idle',
	error: null,
}

export const login = createAsyncThunk('auth/login', async ({ login, password }, { rejectWithValue }) => {
	try {
		const res = await fetch(`${API}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ login, password }),
		})

		if (!res.ok) {
			const error = await res.text()
			return rejectWithValue(error.message || 'Invalid credentials')
		}

		const data = await res.json()
		return data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { getState, rejectWithValue }) => {
	try {
		const token = getState().auth.accessToken
		if (!token) return rejectWithValue('No token found')

		const res = await fetch(`${API}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (res.status === 401) return rejectWithValue({ code: 401, message: 'Unauthorized' })

		if (!res.ok) {
			const error = await res.text()
			return rejectWithValue(error.message || 'Unauthorized')
		}

		// {...userData}
		const data = await res.json()
		return data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// logout - clear auth state and localStorage
		logout(state) {
			state.accessToken = null
			state.user = null
			state.status = 'idle'
			state.error = null
			persistAuth(null, null)
		},
		// clearError - clear error state
		clearError(state) {
			state.error = null
		},
	},
	extraReducers: builder => {
		builder
			.addCase(login.pending, state => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.accessToken = action.payload.token
				state.user = {
					id: action.payload.userId,
					login: action.payload.login,
					role: action.payload.role,
					userType: action.payload.userType,
				}

				persistAuth(state.accessToken, state.user)
			})
			.addCase(login.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload || action.error.message
			})
			.addCase(fetchMe.pending, state => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(fetchMe.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.user = action.payload
				persistAuth(state.accessToken, state.user)
			})
			.addCase(fetchMe.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload || action.error.message
			})
	},
})

export const { logout, clearError } = authSlice.actions

export const selectAuth = state => state.auth

export const selectIsAuth = state => Boolean(state.auth.accessToken)

export const selectUser = state => state.auth.user

export const selectRole = state => state.auth.user?.role ?? null

export const selectIsAdmin = state => selectRole(state) === 'Admin'

export const selectCanManage = state => ['Admin', 'Staff'].includes(selectRole(state))

export const selectCanView = state => ['Admin', 'Staff', 'ReadOnly'].includes(selectRole(state))

export const selectCanDelete = state => selectRole(state) === 'Admin'

export const selectCeadOnly = state => selectRole(state) === 'Guest'

export const selectIsCustomer = state => selectRole(state) === 'Customer'

export default authSlice.reducer

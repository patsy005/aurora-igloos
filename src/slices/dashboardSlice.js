import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from './_fetchWithAuth'

export const fetchDashboardSales = createAsyncThunk('dashboard/fetchSales', async ({ months = 12 } = {}, thunkApi) => {
	return await apiFetch(`/dashboard/sales?months=${months}`, {}, thunkApi)
})

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async ({ days = 30 } = {}, thunkApi) => {
	return await apiFetch(`/dashboard/stats?days=${days}`, {}, thunkApi)
})

const initialState = {
	sales: [],
	salesMonths: 12,
	isLoadingSales: false,
	salesError: null,

	stats: null,
	isLoadingStats: false,
	statsError: null,
	statsDays: 30,
}

const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchDashboardSales.pending, state => {
				state.isLoadingSales = true
				state.salesError = null
			})
			.addCase(fetchDashboardSales.fulfilled, (state, action) => {
				state.sales = action.payload ?? []
				state.isLoadingSales = false
				state.salesError = null
				state.salesMonths = action.meta.arg?.months ?? state.salesMonths ?? 12
			})
			.addCase(fetchDashboardSales.rejected, (state, action) => {
				state.isLoadingSales = false
				state.salesError = action.error?.message ?? 'Failed to load chart data'
			})
			.addCase(fetchDashboardStats.pending, state => {
				state.isLoadingStats = true
				state.statsError = null
			})
			.addCase(fetchDashboardStats.fulfilled, (state, action) => {
				state.stats = action.payload
				state.isLoadingStats = false
				state.statsError = null
				state.statsDays = action.meta.arg?.days ?? state.statsDays ?? 30
			})
			.addCase(fetchDashboardStats.rejected, (state, action) => {
				state.isLoadingStats = false
				state.statsError = action.payload ?? action.error?.message ?? 'Failed to load dashboard stats'
			})
	},
})

export default dashboardSlice.reducer

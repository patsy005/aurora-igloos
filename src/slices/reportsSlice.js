import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetchFile } from './_fetchFileWithAuth'

const initialState = {
	status: 'idle',
	isFetching: false,
	error: '',
	lastFileName: '',
}

export const generateReport = createAsyncThunk('reports/generateReport', async (requestDto, thunkApi) => {
	const result = await apiFetchFile(
		'/reports/dashboard',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestDto),
		},
		thunkApi
	)

	// Jeśli apiFetchFile zwróci rejectWithValue, tu w ogóle nie wejdziemy (thunk przerwany)
	if (!result?.blob) {
		return thunkApi.rejectWithValue({ message: 'No file returned from server.' })
	}

	const { blob, fileName, contentType } = result

	// Jeżeli backend jednak nie zwróci PDF/XLSX (np. HTML error page), pokaż błąd
	const okType =
		contentType.includes('application/pdf') ||
		contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

	if (!okType) {
		const text = await blob.text().catch(() => '')
		return thunkApi.rejectWithValue({
			message: text || `Unexpected content-type: ${contentType}`,
		})
	}

	const url = window.URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = fileName || 'report'
	document.body.appendChild(a)
	a.click()
	a.remove()
	window.URL.revokeObjectURL(url)

	return { fileName }
})

const reportsSlice = createSlice({
	name: 'reports',
	initialState,
	reducers: {
		clearReportsState: state => {
			state.status = 'idle'
			state.isFetching = false
			state.error = ''
			state.lastFileName = ''
		},
	},
	extraReducers: builder => {
		builder
			.addCase(generateReport.pending, state => {
				state.isFetching = true
				state.status = 'loading'
				state.error = ''
			})
			.addCase(generateReport.fulfilled, (state, action) => {
				state.isFetching = false
				state.status = 'succeeded'
				state.lastFileName = action.payload?.fileName || ''
			})
			.addCase(generateReport.rejected, (state, action) => {
				state.isFetching = false
				state.status = 'failed'
				state.error = action.payload?.message || action.error?.message || 'Failed to generate report'
			})
	},
})

export const { clearReportsState } = reportsSlice.actions
export default reportsSlice.reducer

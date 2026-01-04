import { logout } from '../slices/authSlice'

const API = 'http://localhost:5212/api'

function parseFilename(contentDisposition) {
	if (!contentDisposition) return null
	// np. attachment; filename="report_20260101_20260131.pdf"
	const match = contentDisposition.match(/filename="?([^"]+)"?/i)
	return match?.[1] ?? null
}

export async function apiFetchFile(path, options = {}, thunkApi) {
	const token = thunkApi.getState().auth.accessToken

	const res = await fetch(`${API}${path}`, {
		...options,
		headers: {
			...(options.headers || {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	})

	if (res.status === 401 || res.status === 403) {
		thunkApi.dispatch(logout())
		throw thunkApi.rejectWithValue({ code: res.status, message: 'Sesja wygasła' })
	}

	if (!res.ok) {
		const text = await res.text().catch(() => '')
		throw thunkApi.rejectWithValue({
			code: res.status,
			message: text || `Request failed (${res.status})`,
		})
	}

	const blob = await res.blob()
	const contentType = res.headers.get('content-type') || 'application/octet-stream'
	const fileName =
		parseFilename(res.headers.get('content-disposition')) || `report.${contentType.includes('pdf') ? 'pdf' : 'xlsx'}`

	return { blob, fileName, contentType }
}

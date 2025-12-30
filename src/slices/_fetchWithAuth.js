import { logout } from '../slices/authSlice'

const API = 'http://localhost:5212/api'

async function safeJson(res) {
	try {
		return await res.json()
	} catch {
		return null
	}
}

export async function apiFetch(path, options = {}, thunkApi) {
	const token = thunkApi.getState().auth.accessToken

	const res = await fetch(`${API}${path}`, {
		...options,
		headers: {
			...(options.headers || {}), // ✅ Twoje headery zostają
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	})

	// ✅ backend wylogował -> frontend też
	if (res.status === 401 || res.status === 403) {
		thunkApi.dispatch(logout())
		return thunkApi.rejectWithValue({ code: res.status, message: 'Sesja wygasła' })
	}

	if (!res.ok) {
		// jak masz tekstowe błędy z backendu:
		const text = await res.text().catch(() => '')
		const body = await safeJson(res)
		return thunkApi.rejectWithValue({
			code: res.status,
			message: body?.message || text || `Request failed (${res.status})`,
		})
	}

	if (res.status === 204) return null
	return await safeJson(res)
}

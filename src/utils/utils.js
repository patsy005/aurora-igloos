import { PAGE_SIZE } from './consts'

export const convertPageToOffsetLimit = (page, pageSize = PAGE_SIZE) => {
	let offset = 0
	if (page > 1) {
		offset = (page - 1) * pageSize
	}
	return [{ offset: offset }, { limit: pageSize }]
}

export const normalizeEmail = (email = '') => email.trim().toLowerCase()

export const findExistingCustomerByEmail = (customers, email) => {
	if (!email || !customers?.length) return null

	const normalizedEmail = normalizeEmail(email)

	return customers.find(c => normalizeEmail(c.email) === normalizedEmail) ?? null
}

export const formatDateOnly = date => {
	if (!date) return null
	const year = date.getFullYear()

	// padStart ensures two digits
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

export const parseDateOnly = string => {
	if (!string) return null
	return new Date(string + 'T00:00:00')
}

export const isBetweenDates = (date, start, end) => {
	if (!date || !start || !end) return true
	return date >= start && date <= end
}

export const formatDate = dateString => {
	if (!dateString) return '-'
	return new Date(dateString).toLocaleDateString('pl-PL', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

export const contentArrayToMap = items => {
	if (!Array.isArray(items)) return {}

	return items.reduce((acc, item) => {
		if (item?.key) {
			acc[item.key] = item.value
		}
		return acc
	}, {})
}


export const getContentFromMap = (map, key, fallback = '') => {
	if (!map) return fallback
	return map[key] ?? fallback
}

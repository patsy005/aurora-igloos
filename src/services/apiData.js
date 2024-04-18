export async function getIgloos() {
	const res = await fetch('../../public/data/data.json/igloos')
	const data = await res.json()
	return data
}

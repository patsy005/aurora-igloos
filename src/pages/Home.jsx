import { useDispatch } from 'react-redux'
import { fetchIgloos } from '../slices/igloosSlice'
import HomePopularIgloos from '../ui/Home/HomePopularIgloos'
import HomeOverview from '../ui/Home/HomeOverview'
import data from '../../public/data.json'
import SalesChart from '../ui/Home/SalesChart'

function Home() {
	const dispatch = useDispatch()
	const users = data.users
	const user = users.find(user => user.id === 103)

	dispatch(fetchIgloos())
	return (
		<>
			<HomeOverview user={user} />
			<HomePopularIgloos />
			<SalesChart />
		</>
	)
}

export default Home

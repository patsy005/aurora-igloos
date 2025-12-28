import { useDispatch, useSelector } from 'react-redux'
import { fetchIgloos } from '../slices/igloosSlice'
import HomePopularIgloos from '../ui/Home/HomePopularIgloos'
import HomeOverview from '../ui/Home/HomeOverview'
import data from '../../public/data.json'
import SalesChart from '../ui/Home/SalesChart'
import { useEffect } from 'react'
import { fetchMe, selectUser } from '../slices/authSlice'

function Home() {
	const user = useSelector(selectUser)
	const token = useSelector(state => state.auth.accessToken)

	const dispatch = useDispatch()

	useEffect(() => {
		if (token) dispatch(fetchMe())
	}, [token])

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

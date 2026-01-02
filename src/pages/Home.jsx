import { useDispatch, useSelector } from 'react-redux'
import { fetchIgloos } from '../slices/igloosSlice'
import HomePopularIgloos from '../ui/Home/HomePopularIgloos'
import HomeOverview from '../ui/Home/HomeOverview'
import data from '../../public/data.json'
import SalesChart from '../ui/Home/SalesChart'
import { useEffect } from 'react'
import { fetchMe, selectUser } from '../slices/authSlice'
import Spinner from '../components/spinner/Spinner'

function Home() {
	const user = useSelector(selectUser)
	const token = useSelector(state => state.auth.accessToken)

	const isLoadingStats = useSelector(state => state.dashboard.isLoadingStats)
	const isLoadingSales = useSelector(state => state.dashboard.isLoadingSales)

	const hasStats = useSelector(state => state.dashboard.stats != null)
	const hasSales = useSelector(state => (state.dashboard.sales?.length ?? 0) > 0)

	const dispatch = useDispatch()

	useEffect(() => {
		if (token) dispatch(fetchMe())
	}, [token])

	useEffect(() => {
		dispatch(fetchIgloos())
	}, [])

	const showSpinner = (isLoadingStats && !hasStats) || (isLoadingSales && !hasSales)

	if (showSpinner) return <Spinner className="page" />
	
	return (
		<>
			<HomeOverview user={user} />
			<HomePopularIgloos />
			<SalesChart />
		</>
	)
}

export default Home

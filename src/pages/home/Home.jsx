import { useDispatch, useSelector } from "react-redux"
import { fetchMe, selectUser } from "../../slices/authSlice"
import { useEffect } from "react"
import { fetchIgloos } from "../../slices/igloosSlice"
import Spinner from "../../components/spinner/Spinner"
import HomeStatsOverview from "./HomeOverview"
import HomePopularIgloos from "./HomePopularIgloos"
import SalesChart from "../../components/sales-chart/SalesChart"

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
			<HomeStatsOverview user={user} />
			<HomePopularIgloos />
			<SalesChart />
		</>
	)
}

export default Home

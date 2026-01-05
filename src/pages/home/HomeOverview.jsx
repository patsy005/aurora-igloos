import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats } from '../../slices/dashboardSlice'
import HomeHeading from './HomeHeading'
import SelectComponent from '../../components/select/SelectComponent'
import OverviewCard from '../../components/overview-card/OverviewCard'
import { BookingsIcon, CheckinsIcon, OccupancyRateIcon } from '../../ui/Icons'
import StayLengthChart from '../../components/stay-length-chart/StayLengthChart'

function HomeOverview({ user }) {
	const dispatch = useDispatch()

	const stats = useSelector(state => state.dashboard.stats)
	const isLoadingStats = useSelector(state => state.dashboard.isLoadingStats)
	const error = useSelector(state => state.dashboard.statsError)

	// options: value MUST be number
	const options = useMemo(
		() => [
			{ value: 7, label: 'Last 7 days' },
			{ value: 14, label: 'Last 14 days' },
			{ value: 30, label: 'Last 30 days' },
		],
		[]
	)

	console.log(stats)
	const [days, setDays] = useState(30)

	const selectedOption = useMemo(() => options.find(o => o.value === days) ?? options[2], [options, days])

	useEffect(() => {
		dispatch(fetchDashboardStats({ days }))
	}, [dispatch, days])

	if (error) {
		return <p className="error-msg">{typeof error === 'string' ? error : error?.message ?? 'Error'}</p>
	}

	return (
		<section className="section mt-5">
			<HomeHeading user={user} />

			<div className="overview section-box section-margin">
				<div className="overview-top justify-content-between">
					<p className="overview-title col-6">Overview</p>

					<SelectComponent
						className={`react-select }`}
						classNamePrefix="react-select"
						options={options}
						value={selectedOption}
						onChangeFn={val => setDays(Number(val))}
						isDisabled={isLoadingStats}
					/>
				</div>

				<div className="overview-content justify-content-between col-12">
					<OverviewCard
						selectedOption={isLoadingStats ? '...' : stats?.bookings ?? 0}
						icon={<BookingsIcon />}
						title="bookings"
						rate={stats?.bookingChangePercent ?? 0}
					/>
					<OverviewCard
						selectedOption={isLoadingStats ? '...' : stats?.checkIns ?? 0}
						icon={<CheckinsIcon />}
						title="checkins"
						rate={stats?.checkInChangePercent ?? 0}
					/>
					<OverviewCard
						selectedOption={isLoadingStats ? '...' : stats?.occupancy ?? 0}
						icon={<OccupancyRateIcon />}
						title="occupancy"
						rate={stats?.occupancyChangePercent ?? 0}
					/>
				</div>
			</div>

			<div className="d-flex pie-charts section-margin">
				<div className="overview section-box stay-length-pie-box">
					<h3>Stay duration summary</h3>
					<StayLengthChart />
				</div>
			</div>
		</section>
	)
}

export default HomeOverview

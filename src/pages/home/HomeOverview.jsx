import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats } from '../../slices/dashboardSlice'
import HomeHeading from './HomeHeading'
import SelectComponent from '../../components/select/SelectComponent'
import { BookingsIcon, CheckinsIcon, OccupancyRateIcon } from '../../ui/Icons'
import StayLengthChart from '../../components/stay-length-chart/StayLengthChart'
import OverviewCard from '../../components/overview-card/OverviewCard'
import './HomeOverview.scss'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import { get } from 'react-hook-form'

function HomeOverview({ user }) {
	const dispatch = useDispatch()

	const stats = useSelector(state => state.dashboard.stats)
	const isLoadingStats = useSelector(state => state.dashboard.isLoadingStats)
	const error = useSelector(state => state.dashboard.statsError)
	const content = useSelector(state => state.contentBlocks.items)

	// const options = JSON.parse(contentBlock.value)
	const contentOptions = useMemo(() => contentArrayToMap(content), [content])

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	// options: value MUST be number
	const options = useMemo(
		() => [
			{ value: 7, label: 'Last 7 days' },
			{ value: 14, label: 'Last 14 days' },
			{ value: 30, label: 'Last 30 days' },
		],
		[]
	)

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

			<div className="home-overview__section section-margin">
				<div className="home-overview__header">
					<div className="title-section">
						<span className="icon">{getContentFromMap(contentMap, 'home.overview.section.title.icon', '')}</span>
						<h2>{getContentFromMap(contentMap, 'home.overview.section.title', 'Overview')}</h2>
					</div>
					<div className="d-flex align-items-center gap-3">
						<p className="subtitle">Statistics from last {days} days</p>
						<SelectComponent
							className="react-select"
							classNamePrefix="react-select"
							options={options}
							value={selectedOption}
							onChangeFn={val => setDays(Number(val))}
							isDisabled={isLoadingStats}
						/>
					</div>
				</div>

				<div className="home-overview__cards">
					<OverviewCard
						title={getContentFromMap(contentMap, 'home.overview.bookings.title', 'Bookings')}
						icon={<BookingsIcon />}
						value={stats?.bookings ?? 0}
						changePercent={stats?.bookingChangePercent}
						isLoading={isLoadingStats}
					/>
					<OverviewCard
						title={getContentFromMap(contentMap, 'home.overview.checkins.title', 'Check-Ins')}
						icon={<CheckinsIcon />}
						value={stats?.checkIns ?? 0}
						changePercent={stats?.checkInChangePercent}
						isLoading={isLoadingStats}
					/>
					<OverviewCard
						title={getContentFromMap(contentMap, 'home.overview.occupancy.title', 'Occupancy Rate')}
						icon={<OccupancyRateIcon />}
						value={`${stats?.occupancy ?? 0}%`}
						changePercent={stats?.occupancyChangePercent}
						isLoading={isLoadingStats}
					/>
				</div>
			</div>

			<div className="d-flex pie-charts section-margin">
				<div className="overview section-box stay-length-pie-box">
					<h3>{getContentFromMap(contentMap, 'home.stayDuration.title', 'Stay duration summary')}</h3>
					<StayLengthChart />
				</div>
			</div>
		</section>
	)
}

export default HomeOverview

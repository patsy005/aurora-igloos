import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats } from '../../slices/dashboardSlice'
import HomeHeading from './HomeHeading'
import SelectComponent from '../../components/select/SelectComponent'
import { BookingsIcon, CheckinsIcon, OccupancyRateIcon } from '../../ui/Icons'
import StayLengthChart from '../../components/stay-length-chart/StayLengthChart'
import './HomeOverview.scss'

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

			<div className="home-overview__section section-margin">
				<div className="home-overview__header">
					<div className="title-section">
						<span className="icon">📊</span>
						<h2>Overview</h2>
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
					{/* Bookings Card */}
					<div className="overview-card-new">
						<div className="overview-card-new__left">
							<div className="overview-card-new__icon">
								<BookingsIcon />
							</div>
							<div className="overview-card-new__content">
								<p className="overview-card-new__title">Bookings</p>
								<p className="overview-card-new__value">{isLoadingStats ? '...' : stats?.bookings ?? 0}</p>
							</div>
						</div>
						{stats?.bookingChangePercent !== 0 && (
							<div
								className={`overview-card-new__badge ${
									stats?.bookingChangePercent > 0
										? 'overview-card-new__badge--positive'
										: 'overview-card-new__badge--negative'
								}`}>
								<span className="arrow">{stats?.bookingChangePercent > 0 ? '↗' : '↘'}</span>
								<span>
									{stats?.bookingChangePercent > 0 ? '+' : ''}
									{stats?.bookingChangePercent ?? 0}%
								</span>
							</div>
						)}
					</div>

					{/* Check-ins Card */}
					<div className="overview-card-new">
						<div className="overview-card-new__left">
							<div className="overview-card-new__icon">
								<CheckinsIcon />
							</div>
							<div className="overview-card-new__content">
								<p className="overview-card-new__title">Check-ins</p>
								<p className="overview-card-new__value">{isLoadingStats ? '...' : stats?.checkIns ?? 0}</p>
							</div>
						</div>
						{stats?.checkInChangePercent !== 0 && (
							<div
								className={`overview-card-new__badge ${
									stats?.checkInChangePercent > 0
										? 'overview-card-new__badge--positive'
										: 'overview-card-new__badge--negative'
								}`}>
								<span className="arrow">{stats?.checkInChangePercent > 0 ? '↗' : '↘'}</span>
								<span>
									{stats?.checkInChangePercent > 0 ? '+' : ''}
									{stats?.checkInChangePercent ?? 0}%
								</span>
							</div>
						)}
					</div>

					{/* Occupancy Card */}
					<div className="overview-card-new">
						<div className="overview-card-new__left">
							<div className="overview-card-new__icon">
								<OccupancyRateIcon />
							</div>
							<div className="overview-card-new__content">
								<p className="overview-card-new__title">Occupancy</p>
								<p className="overview-card-new__value">{isLoadingStats ? '...' : `${stats?.occupancy ?? 0}%`}</p>
							</div>
						</div>
						{stats?.occupancyChangePercent !== 0 && (
							<div
								className={`overview-card-new__badge ${
									stats?.occupancyChangePercent > 0
										? 'overview-card-new__badge--positive'
										: 'overview-card-new__badge--negative'
								}`}>
								<span className="arrow">{stats?.occupancyChangePercent > 0 ? '↗' : '↘'}</span>
								<span>
									{stats?.occupancyChangePercent > 0 ? '+' : ''}
									{stats?.occupancyChangePercent ?? 0}%
								</span>
							</div>
						)}
					</div>
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

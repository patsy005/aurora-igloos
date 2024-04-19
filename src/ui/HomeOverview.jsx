import { useState } from 'react'
import { BookingsIcon, CheckinsIcon, OccupancyRateIcon } from './Icons'
import OverviewDropdown from './OverviewDropdown'
import data from '../../public/data.json'

function HomeOverview({ user }) {
	const [selectedOption, setSelectedOption] = useState({ label: 'Last 30 days', value: 'last30Days' })
	const stats = data.stats

	const options = [
		{ label: 'Last 7 days', value: 'last7Days' },
		{ label: 'Last 14 days', value: 'last14Days' },
		{ label: 'Last 30 days', value: 'last30Days' },
	]

	// const calculateRate = (current, previous) => {
	// 	return (((current - previous) / previous) * 100).toFixed(1)
	// }

	return (
		<section className="section mt-5">
			<div className="heading section-margin">
				<h1>Dashboard</h1>
				<p>
					Welcome back, <span>{user.name}</span>!
				</p>
			</div>

			<div className="overview section-box section-margin">
				<div className="overview-top justify-content-between">
					<p className="overview-title col-6">Overwiev</p>
					<OverviewDropdown options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
				</div>
				<div className="overview-content justify-content-between col-12">
					<div className="overview-card col-sm-3 col-xxl-2 mt-3">
						<div className="overview-card__icon-box overview-card__icon-box--bookings">
							<BookingsIcon />
						</div>
						<div className="overview-card__stats">
							<div className="overview-card__stats--box overview-card__stats--box-bookings">
								<p className="overview-card__stats--title">Bookings</p>
								<p className="overview-card__stats--number">{stats.bookings[selectedOption.value]}</p>
							</div>
							<div className="overview-card__percentage-stats overview-card__percentage-stats--plus">
								<p className="overview-card__percentage-stats--text">
									<span>+</span>
									<span>34,7</span>%
								</p>
							</div>
						</div>
					</div>
					<div className="overview-card col-sm-3 col-xxl-2 mt-3">
						<div className="overview-card__icon-box overview-card__icon-box--checkins">
							<CheckinsIcon />
						</div>
						<div className="overview-card__stats">
							<div className="overview-card__stats--box overview-card__stats--box-checkins">
								<p className="overview-card__stats--title">check ins</p>
								<p className="overview-card__stats--number">{stats.checkIns[selectedOption.value]}</p>
							</div>
							<div className="overview-card__percentage-stats overview-card__percentage-stats--minus">
								<p className="overview-card__percentage-stats--text">
									<span>-</span>
									<span>34,7</span>%
								</p>
							</div>
						</div>
					</div>
					<div className="overview-card col-sm-3 col-xxl-2 mt-3">
						<div className="overview-card__icon-box overview-card__icon-box--occupancy">
							<OccupancyRateIcon />
						</div>
						<div className="overview-card__stats">
							<div className="overview-card__stats--box overview-card__stats--box-occupancy">
								<p className="overview-card__stats--title">occupancy</p>
								<p className="overview-card__stats--number">
									<span>{stats.occupancyRate[selectedOption.value]}</span>%
								</p>
							</div>
							<div className="overview-card__percentage-stats overview-card__percentage-stats--plus">
								<p className="overview-card__percentage-stats--text">
									<span>-</span>
									<span>34,7</span>%
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HomeOverview

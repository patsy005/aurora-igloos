import { useState } from 'react'
import { BookingsIcon, CheckinsIcon, OccupancyRateIcon } from '../Icons'
import OverviewDropdown from './OverviewDropdown'
import data from '../../../public/data.json'
import OverviewCard from './OverviewCard'
import SectionHeading from '../SectionHeading'
import StayLenghtChart from './StayLenghtChart'
import EmployeeOfMonth from './EmployeeOfMonth'

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
			<SectionHeading sectionTitle="dashboard">
				<p>
					Welcome back, <span>{user.name}</span>!
				</p>
			</SectionHeading>

			<div className="overview section-box section-margin">
				<div className="overview-top justify-content-between">
					<p className="overview-title col-6">Overwiev</p>
					<OverviewDropdown options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
				</div>
				<div className="overview-content justify-content-between col-12">
					<OverviewCard
						selectedOption={stats.bookings[selectedOption.value]}
						icon={<BookingsIcon />}
						title="bookings"
						rate="plus"
					/>
					<OverviewCard
						selectedOption={stats.checkIns[selectedOption.value]}
						icon={<CheckinsIcon />}
						title="checkins"
						rate="minus"
					/>
					<OverviewCard
						selectedOption={stats.occupancyRate[selectedOption.value]}
						icon={<OccupancyRateIcon />}
						title="occupancy"
						rate="plus"
					/>
				</div>
			</div>

			<div className="d-flex pie-charts section-margin">
				<div className="overview section-box  stay-length-pie-box">
					<h3>Stay duration summary</h3>
					<StayLenghtChart />
				</div>
				<div className="overview section-box stay-length-pie-box">
					<h3>Employee of the month</h3>
					<EmployeeOfMonth />
				</div>
			</div>
		</section>
	)
}

export default HomeOverview

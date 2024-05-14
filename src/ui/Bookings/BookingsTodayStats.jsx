import OverviewCard from '../Home/OverviewCard'
import { BookingsIcon, CheckinsIcon, OccupancyRateIcon } from '../Icons'

function BookingsTodayStats() {
	return (
		<div className="overview section-box section-margin">
			<div className="overview-top justify-content-between">
				<p className="overview-title col-6">Today Stats</p>
			</div>

			<div className="overview-content justify-content-between col-12">
				<OverviewCard selectedOption="20" icon={<BookingsIcon />} title="bookings" />
				<OverviewCard selectedOption="5" icon={<CheckinsIcon />} title="checkins" />
				<OverviewCard selectedOption="87" icon={<OccupancyRateIcon />} title="occupancy" />
			</div>
		</div>
	)
}

export default BookingsTodayStats

import { useSelector } from 'react-redux'
import BookingChart from '../booking-chart/BookingChart'

function SalesChart() {
	const months = useSelector(state => state.dashboard.salesMonths)

	const label = months === 12 ? 'Last 12 months' : months === 6 ? 'Last 6 months' : `Last ${months} months`

	return (
		<section className="section section-stats section-margin">
			<div className="heading section-margin">
				<h2>Sales from {label}</h2>
			</div>
			<div className="section-box section-stats__box">
				<div className="col-12" style={{ width: '100%', height: '30rem' }}>
					<BookingChart />
				</div>
			</div>
		</section>
	)
}

export default SalesChart

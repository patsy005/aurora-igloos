import { CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, ComposedChart, Bar, Line } from 'recharts'
import data from '../../../public/data.json'

function BookingChart() {
	const colors = {
		revenueCurrentYear: 'rgba(0, 230, 255, .7)',
		revenuePreviousYear: '#ffa24f',
		text: '#cffaff',
	}
	return (
		<ResponsiveContainer width="100%" height="100%">
			<ComposedChart
				width={500}
				height={400}
				data={data.sales}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}>
				<CartesianGrid strokeDasharray="3" />
				<XAxis dataKey="month" tick={{ fill: colors.text }} tickLine={{ fill: colors.text }} />
				<YAxis unit="$" tick={{ fill: colors.text }} tickLine={{ fill: colors.text }} />
				<Tooltip />
				<Bar dataKey="revenueCurrentYear" barSize={20} fill={colors.revenueCurrentYear} name="Sales current year" />
				{/* <Line type="monotone" dataKey="revenueCurrentYear" stroke={colors.revenueCurrentYear} /> */}
				<Line
					type="monotone"
					dataKey="revenuePreviousYear"
					stroke={colors.revenuePreviousYear}
					name="Sales previous year"
				/>
				{/* <Area
					type="monotone"
					dataKey="revenueCurrentYear"
					stroke={colors.revenueCurrentYear.stroke}
					fill={colors.revenueCurrentYear.fill}
					strokeWidth={2}
					unit="$"
					name="Sales current year"
				/>
				<Area
					type="monotone"
					dataKey="revenuePreviousYear"
					stroke={colors.revenuePreviousYear.stroke}
					fill={colors.revenuePreviousYear.fill}
					strokeWidth={2}
					unit="$"
					name="Sales previous year"
				/> */}
			</ComposedChart>
		</ResponsiveContainer>
	)
}

export default BookingChart

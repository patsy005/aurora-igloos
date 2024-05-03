import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts'
import data from '../../../public/data.json'

function RevenueChart() {
	const bookings = data.bookings

	const totalRevenue = data.sales.reduce((acc, item) => acc + item.revenueCurrentYear, 0)

	// Przygotowujemy dane do wykresu pie
	const pieData = data.sales.map(item => ({
		name: item.month,
		value: (item.revenueCurrentYear / totalRevenue) * 100, // Obliczamy procentowy udział przychodu z rezerwacji dla danego miesiąca
	}))

	const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']

	return (
		<ResponsiveContainer width="100%" height={240}>
			<PieChart>
				<Pie
					data={pieData}
					cx={200}
					// cy={200}
					labelLine={false}
					fill="#8884d8"
					innerRadius={85}
					outerRadius={110}
					paddingAngle={3}
					startAngle={180}
					endAngle={-180}
					nameKey="name"
					dataKey="value">
					{pieData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
				{/* <Legend
					verticalAlign="middle"
					align="right"
					width="30%"
					layout="vertical"
					iconSize={15}
					iconType="circle"
					formatter={(value, entry) => [value, ' bookings']}
				/> */}
			</PieChart>
		</ResponsiveContainer>
	)
}

export default RevenueChart

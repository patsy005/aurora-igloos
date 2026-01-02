/* eslint-disable no-unused-vars */
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import data from '../../../public/data.json'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchBookings } from '../../slices/bookingsSlice'

function StayLengthChart() {
	const bookings = useSelector(state => state.bookings.bookings)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchBookings())
	}, [])

	const calcStayLenghts = () => {
		return bookings.map(booking => {
			const checkInDate = new Date(booking.checkIn)
			const checkOutDate = new Date(booking.checkOut)
			const stayLenght = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
			return stayLenght
		})
	}

	const calcStayLengthCount = stayLengths => {
		const stayLengthCount = stayLengths.reduce((acc, stayLength) => {
			acc[stayLength] = acc[stayLength] ? acc[stayLength] + 1 : 1
			return acc
		}, {})
		// return Object.keys(stayLengthCount).map(key => ({ stayLength: parseInt(key) }))
		return Object.keys(stayLengthCount).map(key => ({ stayLength: key, count: stayLengthCount[key] }))
	}

	const pieData = calcStayLengthCount(calcStayLenghts())

	const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5
		const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
		const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

		return (
			<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		)
	}

	return (
		<ResponsiveContainer width="100%" height={240}>
			<PieChart>
				<Pie
					data={pieData}
					cx="40%"
					cy="50%"
					labelLine={false}
					label={renderCustomizedLabel}
					fill="#8884d8"
					innerRadius={85}
					outerRadius={110}
					paddingAngle={3}
					startAngle={180}
					endAngle={-180}
					dataKey="count">
					{pieData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
				<Legend
					verticalAlign="middle"
					align="right"
					width="30%"
					layout="vertical"
					iconSize={15}
					iconType="circle"
					formatter={(value, entry) => [value, ' nights']}
				/>
			</PieChart>
		</ResponsiveContainer>
	)
}

export default StayLengthChart

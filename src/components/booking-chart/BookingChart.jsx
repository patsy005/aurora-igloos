import { CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, ComposedChart, Bar, Legend } from 'recharts'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardSales } from '../../slices/dashboardSlice'

function formatCurrency(value) {
	// możesz zmienić walutę na 'PLN' jeśli chcesz
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(value || 0)
}

const CustomLegend = ({ payload }) => {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
			{payload.map(entry => (
				<div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span style={{ width: 12, height: 12, background: entry.color, display: 'inline-block', borderRadius: 2 }} />
					<span style={{ color: '#cffaff' }}>{entry.value}</span>
				</div>
			))}
		</div>
	)
}

function CustomTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null

	const current = payload.find(p => p.dataKey === 'revenueCurrentYear')?.value ?? 0
	const previous = payload.find(p => p.dataKey === 'revenuePreviousYear')?.value ?? 0

	const diff = current - previous
	const diffPct = previous === 0 ? (current === 0 ? 0 : 100) : (diff / previous) * 100

	return (
		<div className="chart-tooltip">
			<p className="chart-tooltip__title">{label}</p>
			<p>
				Current year: <strong>{formatCurrency(current)}</strong>
			</p>
			<p>
				Previous year: <strong>{formatCurrency(previous)}</strong>
			</p>
			<p>
				Difference: <strong>{formatCurrency(diff)}</strong> ({diffPct.toFixed(1)}%)
			</p>
		</div>
	)
}

function BookingChart({ months = 12 }) {
	const dispatch = useDispatch()

	const sales = useSelector(state => state.dashboard.sales)
	const isLoading = useSelector(state => state.dashboard.isLoadingSales)
	const error = useSelector(state => state.dashboard.salesError)
	const bookings = useSelector(state => state.bookings.bookings)

	useEffect(() => {
		dispatch(fetchDashboardSales({ months }))
	}, [dispatch, months, bookings.length])

	// kolory jak miałaś
	const colors = useMemo(
		() => ({
			revenueCurrentYear: 'rgba(0, 230, 255, .7)',
			revenuePreviousYear: '#ffa24f',
			text: '#cffaff',
		}),
		[]
	)

	if (isLoading) return <div>Loading chart...</div>
	if (error) return <div>Chart error: {error}</div>
	if (!sales?.length) return <div>No chart data.</div>

	return (
		<ResponsiveContainer width="100%" height="100%">
			<ComposedChart data={sales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barGap={6}>
				<CartesianGrid strokeDasharray="3" />
				<XAxis dataKey="month" tick={{ fill: colors.text }} tickLine={{ fill: colors.text }} />
				<YAxis
					tick={{ fill: colors.text }}
					tickLine={{ fill: colors.text }}
					tickFormatter={value => (value >= 1000 ? `${Math.round(value / 1000)}k` : value)}
				/>

				<Tooltip content={<CustomTooltip />} />
				<Legend content={<CustomLegend />} />

				<Bar
					dataKey="revenueCurrentYear"
					barSize={18}
					fill={colors.revenueCurrentYear}
					name="Current year"
					radius={[6, 6, 0, 0]}
				/>
				<Bar
					dataKey="revenuePreviousYear"
					barSize={18}
					fill={colors.revenuePreviousYear}
					name="Previous year"
					radius={[6, 6, 0, 0]}
				/>
			</ComposedChart>
		</ResponsiveContainer>
	)
}

export default BookingChart

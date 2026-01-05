import './OverviewCard.scss'

function OverviewCard({ title, icon, value, changePercent, isLoading }) {
	return (
		<div className="overview-card-new">
			<div className="overview-card-new__left">
				<div className="overview-card-new__icon">{icon}</div>
				<div className="overview-card-new__content">
					<p className="overview-card-new__title">{title}</p>
					<p className="overview-card-new__value">{isLoading ? '...' : value}</p>
				</div>
			</div>
			{changePercent !== undefined && changePercent !== 0 && (
				<div
					className={`overview-card-new__badge ${
						changePercent > 0 ? 'overview-card-new__badge--positive' : 'overview-card-new__badge--negative'
					}`}>
					<span className="arrow">{changePercent > 0 ? '↗' : '↘'}</span>
					<span>
						{changePercent > 0 ? '+' : ''}
						{changePercent}%
					</span>
				</div>
			)}
		</div>
	)
}

export default OverviewCard

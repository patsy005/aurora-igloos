import './ItemDetailsCard.scss'

function ItemDetailsCard({ title, number, additional, additional2, icon, className = '' }) {
	return (
		<div className={`item-details-card ${className}`}>
			{icon && <div className="item-details-card__icon">{icon}</div>}
			<div className="item-details-card__content">
				<p className="item-details-card__title">{title}</p>
				<p className="item-details-card__value">{number}</p>
				{additional && <p className="item-details-card__additional">{additional}</p>}
				{additional2 && <p className="item-details-card__additional">{additional2}</p>}
			</div>
		</div>
	)
}

export default ItemDetailsCard

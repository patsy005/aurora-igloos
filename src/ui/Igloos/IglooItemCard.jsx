function IglooItemCard({ title, number, additional, additional2 }) {
	return (
		<div className="overview-card col-7 col-lg-5 col-xxl-4 mt-3">
			<div className="overview-card__stats">
				<div className={`overview-card__stats--box`}>
					<p className="overview-card__stats--title">{title}</p>
					<p className="overview-card__stats--number">{number}</p>
                    {additional && <p className="additional">{additional}</p>}
                    {additional2 && <p className="additional">{additional2}</p>}
				</div>
			</div>
		</div>
	)
}

export default IglooItemCard

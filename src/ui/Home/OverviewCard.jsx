function OverviewCard({selectedOption, title, icon}) {
    return (
        <div className="overview-card col-sm-3 col-xxl-2 mt-3">
        <div className={`overview-card__icon-box overview-card__icon-box--${title}`}>
            {/* <BookingsIcon /> */}
            {icon}
        </div>
        <div className="overview-card__stats">
            <div className={`overview-card__stats--box overview-card__stats--box-${title}`}>
                <p className="overview-card__stats--title">{title}</p>
                <p className="overview-card__stats--number">{selectedOption}</p>
            </div>
            <div className="overview-card__percentage-stats overview-card__percentage-stats--plus">
                <p className="overview-card__percentage-stats--text">
                    <span>+</span>
                    <span>34,7</span>%
                </p>
            </div>
        </div>
    </div>
    )
}

export default OverviewCard

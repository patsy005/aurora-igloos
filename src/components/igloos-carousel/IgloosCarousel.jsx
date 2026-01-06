import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useNavigate } from 'react-router-dom'
import './IgloosCarousel.scss'

function IgloosCarousel() {
	const igloos = useSelector(state => state.igloos.igloos)
	const bookings = useSelector(state => state.bookings.bookings)
	const navigate = useNavigate()

	const top5 = useMemo(() => {
		if (!igloos?.length) return []

		if (!bookings?.length) {
			return igloos.slice(0, 5).map(i => ({ ...i, bookingsCount: 0 }))
		}

		const countMap = {}
		for (const b of bookings) {
			const iglooId = b?.idIgloo ?? b?.iglooId ?? b?.IdIgloo
			if (!iglooId) continue
			countMap[iglooId] = (countMap[iglooId] || 0) + 1
		}

		// połącz + sort
		const ranked = igloos
			.map(i => ({ ...i, bookingsCount: countMap[i.id] || 0 }))
			.filter(i => i.bookingsCount > 0)
			.sort((a, b) => b.bookingsCount - a.bookingsCount)
			.slice(0, 5)

		if (ranked.length === 0) {
			return igloos.slice(0, 5).map(i => ({ ...i, bookingsCount: 0 }))
		}

		return ranked
	}, [igloos, bookings])

	const settings = {
		dots: true,
		infinite: top5.length > 3,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		adaptiveHeight: true,
		centerMode: true,
		initialSlide: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: { centerMode: true, slidesToShow: 2, slidesToScroll: 1, infinite: top5.length > 2, dots: true },
			},
			{
				breakpoint: 550,
				settings: { slidesToShow: 1, slidesToScroll: 1, infinite: top5.length > 1, dots: true, centerMode: true },
			},
		],
	}

	return (
		<div className="popularIgloos">
			<div className="popularIgloos__header">
				<span className="popularIgloos__icon">❄️</span>
				<p className="popularIgloos__title">POPULAR IGLOOS</p>
			</div>

			<div className="popularIgloos__body">
				<Slider {...settings}>
					{top5.map(igloo => (
						<div key={igloo.id} className="popularIgloos__slide">
							<div
								className="popularIgloos__card"
								onClick={() => navigate(`/igloos/${igloo.id}`)}
								role="button"
								tabIndex={0}>
								<div className="popularIgloos__imgBox">
									{igloo.photoUrl ? (
										<img className="popularIgloos__img" src={`http://localhost:5212/${igloo.photoUrl}`} alt="" />
									) : (
										<div className="popularIgloos__imgPlaceholder">
											<span style={{ fontSize: 28 }}>🖼️</span>
											<span className="popularIgloos__noPhoto">No photo</span>
										</div>
									)}

									{igloo.bookingsCount > 0 && (
										<div className="popularIgloos__badge">
											<span className="popularIgloos__badgeIcon">🔥</span>
											<span className="popularIgloos__badgeText">{igloo.bookingsCount}</span>
										</div>
									)}
								</div>

								<div className="popularIgloos__info">
									<p className="popularIgloos__name" title={igloo.name}>
										{igloo.name}
									</p>
									<p className="popularIgloos__meta">Capacity: {igloo.capacity} guests</p>

									{igloo.pricePerNight != null && <p className="popularIgloos__price">${igloo.pricePerNight}/night</p>}

									{igloo.bookingsCount > 0 ? (
										<p className="popularIgloos__bookings">Booked {igloo.bookingsCount}x</p>
									) : (
										<p className="popularIgloos__bookings popularIgloos__bookings--muted">No bookings yet</p>
									)}
								</div>
							</div>
						</div>
					))}
				</Slider>
			</div>
		</div>
	)
}

export default IgloosCarousel

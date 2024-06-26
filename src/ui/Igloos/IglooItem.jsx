/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import SectionHeading from '../../components/SectionHeading'
import { useState } from 'react'
import DatePicker from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import IglooItemCard from './IglooItemCard'
import { DeleteIcon, EditIcon, GoBackIcon, StarIcon, ViewIcon } from '../Icons'
import IglooItemTable from './IglooItemTable'
import IglooReviewsList from './IglooReviewsList'

function IglooItem() {
	const { iglooId } = useParams()
	const igloos = data.igloos
	const bookings = data.bookings
	const promotions = data.promotions
	const promotion = promotions.find(promo => promo.iglooId.includes(+iglooId))
	const navigate = useNavigate()

	const igloo = igloos.find(igloo => igloo.id === +iglooId)
	const iglooBookings = bookings.filter(booking => booking.iglooId === +iglooId)
	const bookingDates = iglooBookings.map(booking => ({
		checkIn: new Date(booking.checkInDate),
		checkOut: new Date(booking.checkOutDate),
	}))

	const dates = bookingDates.map(booking => [booking.checkIn, booking.checkOut])
	console.log(dates)
	const [datesState, setDatesState] = useState([dates])

	return (
		<section className="item-section section mt-5">
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<p className="mt-4"></p>
			<SectionHeading sectionTitle="igloo"></SectionHeading>

			<div className="item-section__overview section-box section-margin flex-md-row">
				<div className="item-img col-12 col-md-5 col-lg-4">
					<img src={`.${igloo.imagePath}`} alt={igloo.name} />
				</div>
				<div className="item-section__info col-12 col-md-7 justify-content-between">
					<h3 className="item-section__title">{igloo.name}</h3>
					<div className="item-section__promo">
						<p className="promo uppercase-text">
							annual promotion{' '}
							{promotion && (
								<span className="action-icon" onClick={() => navigate(`/promotions/${promotion.id}`)}>
									<ViewIcon />
								</span>
							)}
						</p>
						<p className="promo-title mt-2">{promotion ? promotion.name : '--'}</p>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between">
						<IglooItemCard title="capacity" number={igloo.capacity} />
						<IglooItemCard title="Price per night" number={`$ ${igloo.pricePerNight}`} />
					</div>
					<div className="item-section__availability">
						<p className="uppercase-text mb-4 mt-3">Availability</p>
						<div className="col-7 col-lg-5 col-xxl-4">
							<DatePicker
								className="custom-calendar"
								inputClass="input"
								value={datesState[0]}
								multiple
								range
								plugins={[<DatePanel />]}
								dateSeparator=" - "
								rangeHover
								monthYearSeparator="|"
								portal
							/>
						</div>
					</div>

					<div className="item-section__promo mt-3">
						<p className="promo uppercase-text">Rating</p>
						<div className="promo-title mt-2 d-flex align-items-center gap-2">
							<StarIcon />
							<span>{igloo.rating}</span>
						</div>
					</div>

					<div className="item-section__actions mt-3">
						<span className="action-icon" onClick={() => navigate(`/igloos/${iglooId}/edit`)}>
							<EditIcon />
						</span>
						<span className="action-icon">
							<DeleteIcon />
						</span>
					</div>
				</div>
			</div>

			<div className="section-margin user-item tasks">
				<h3>Bookings</h3>
				<IglooItemTable iglooId={iglooId} />
			</div>

			<div className="section-margin user-item tasks">
				<h3>Reviews</h3>
				<IglooReviewsList igloo={igloo} />
			</div>
		</section>
	)
}

export default IglooItem

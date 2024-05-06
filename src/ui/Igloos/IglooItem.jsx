/* eslint-disable react/jsx-key */
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import SectionHeading from '../SectionHeading'
import { useState } from 'react'
import DatePicker from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import IglooItemCard from './IglooItemCard'
import { DeleteIcon, EditIcon, GoBackIcon, ViewIcon } from '../Icons'

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
            <span onClick={() => navigate(-1)} className='go-back'><GoBackIcon /></span>
            <p className='mt-4'></p>
			<SectionHeading sectionTitle="igloo"></SectionHeading>

			<div className="item-section__overview section-box section-margin flex-md-row">
				<div className="item-img col-12 col-md-5 col-lg-4">
					<img src={`../../../public/${igloo.imagePath}`} alt={igloo.name} />
					{/* <img src={igloo.imagePath} alt={igloo.name} /> */}
				</div>
				<div className="item-section__info col-12 col-md-7">
					<h3 className="item-section__title">{igloo.name}</h3>
					<div className="item-section__promo">
						<p className="promo uppercase-text">
							annual promotion{' '}
							<span className="action-icon" onClick={() => navigate(`/promotion/${promotion.id}`)}>
								<ViewIcon />
							</span>
						</p>
						<p className="promo-title mt-2">{promotion.name}</p>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between">
						<IglooItemCard title="capacity" number={igloo.capacity} />
						<IglooItemCard title="Price per night" number={`$ ${igloo.pricePerNight}`} />
					</div>
					<div className="item-section__availability">
						<p className="uppercase-text mb-4 mt-3">Availability</p>
						<DatePicker
							className="custom-calendar"
							inputClass="input"
							value={datesState[0]}
							multiple
							range
							plugins={[<DatePanel />]}
							dateSeparator=" to "
							rangeHover
							monthYearSeparator="|"
							portal
						/>
					</div>

					<div className="item-section__actions mt-3">
						<span className="action-icon" onClick={() => navigate(`/igloo/${iglooId}/edit`)}>
							<EditIcon />
						</span>
						<span className="action-icon">
							<DeleteIcon />
						</span>
					</div>
				</div>
			</div>
		</section>
	)
}

export default IglooItem

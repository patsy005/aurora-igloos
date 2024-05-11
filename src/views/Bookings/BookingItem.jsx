/* eslint-disable react/jsx-key */
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { useState } from 'react'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import SectionHeading from '../../components/SectionHeading'
import IglooItemCard from '../Igloos/IglooItemCard'
import DatePicker from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'

function BookingItem() {
	const { bookingId } = useParams()
	const customers = data.customers
	const promotions = data.promotions
	const bookings = data.bookings
	const igloos = data.igloos
	const navigate = useNavigate()

	const booking = bookings.find(booking => booking.id === +bookingId)
	const hasChecked = booking.status === 'in' || booking === 'out'
	const igloo = igloos.find(igloo => igloo.id === booking.iglooId)
	const customer = customers.find(customer => customer.id === booking.customerId)

	const [dates, setDates] = useState([[booking.checkInDate, booking.checkOutDate]])

	return (
		<section className="item-section section mt-5">
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<p className="mt-4"></p>
			<SectionHeading sectionTitle="booking"></SectionHeading>

			<div className="item-section__overview section-box section-margin flex-md-row">
				<div className="item-img col-12 col-md-5 col-lg-4">
					<img src={`../../../public/${igloo.imagePath}`} alt={igloo.name} />
				</div>
				<div className="item-section__info col-12 col-md-7">
					<h3 className="item-section__title">{igloo.name}</h3>
					<div className="item-section__promo item-section__booking--info d-flex gap-4">
						<div>
							<p className="promo uppercase-text">Amount</p>
							<p className="promo-title mt-2">$ {booking.amount}</p>
						</div>
						<div>
							<span className={`status status__${booking.status} me-3`}>
								{hasChecked && 'checked '}
								{booking.status}
							</span>
						</div>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between flex-wrap flex-xxl-nowrap">
						<IglooItemCard title="Name" number={`${customer.name} ${customer.surname}`} />
						<IglooItemCard title="Email" number={customer.email} />
						<IglooItemCard title="Phone" number={customer.phoneNumber} />
					</div>

					<div className="item-section__availability ">
						<p className="uppercase-text mb-4 mt-3">Availability</p>
						<div className="col-7 col-lg-5 col-xxl-4">
							<DatePicker
								className="custom-calendar"
								inputClass="input"
								value={dates[0]}
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

					<div className="item-section__actions mt-3">
						<span className="action-icon" onClick={() => navigate(`/bookings/${bookingId}/edit`)}>
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

export default BookingItem

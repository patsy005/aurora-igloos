import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import SectionHeading from '../../components/SectionHeading'
import IglooItemCard from '../../ui/Igloos/IglooItemCard'
import { formatDate, formatDateOnly, parseDateOnly } from '../../utils/utils'
import { useModal } from '../../contexts/modalContext'
import BookingsForm from './BookingsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'

function BookingsItem() {
	const { bookingId } = useParams()
	const bookings = useSelector(state => state.bookings.bookings)
	const igloos = useSelector(state => state.igloos.igloos)
	const trips = useSelector(state => state.trips.trips)
	const navigate = useNavigate()
	const { openModal } = useModal()

	const booking = bookings.find(booking => booking.id === +bookingId)
	const igloo = igloos.find(igloo => igloo.id === +booking.idIgloo)
	const trip = trips.find(trip => trip.id === +booking.tripId)

	const hasIgloo = !!booking.idIgloo
	const hasTrip = !!booking.tripId

	if (!booking) return <div>Booking not found</div>

	return (
		<section className="item-section section mt-5">
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<p className="mt-4"></p>
			<SectionHeading sectionTitle="booking"></SectionHeading>

			<div className="item-section__overview section-box section-margin flex-md-row">
				<div className="item-img col-12 col-md-5 col-lg-4">
					{hasIgloo ? (
						<img src={`http://localhost:5212/${igloo.photoUrl}`} alt={igloo.name} />
					) : hasTrip ? (
						<img src={`http://localhost:5212/${trip.photoUrl}`} alt={trip.name} />
					) : (
						<p>No image available</p>
					)}
				</div>
				<div className="item-section__info col-12 col-md-7 justify-content-between">
					<h3 className="item-section__title">
						{hasIgloo && igloo ? igloo.name : ''}
						{hasTrip && trip ? (hasIgloo ? ` + ${trip.name}` : trip.name) : ''}
						{hasTrip && !hasIgloo && !trip ? 'Trip not found' : ''}
					</h3>
					<div className="item-section__promo item-section__booking--info d-flex gap-4 justify-content-between">
						<div>
							<p className="promo uppercase-text">Amount</p>
							<p className="promo-title mt-2">$ {booking.amount}</p>
						</div>
						<div>
							{/* <p className="promo uppercase-text">Type</p> */}
							<div className="booking-type-badge">
								{hasIgloo && !hasTrip && <span>Igloo</span>}
								{!hasIgloo && hasTrip && <span>Trip</span>}
								{hasIgloo && hasTrip && <span>Both</span>}
							</div>
						</div>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between flex-wrap flex-xxl-nowrap">
						<IglooItemCard title="Name" number={`${booking.customerName} ${booking.customerSurname}`} />
						<IglooItemCard title="Email" number={booking.customerEmail} />
						<IglooItemCard title="Phone" number={booking.customerPhone} />
						{hasIgloo && (
							<IglooItemCard
								title="Check-in - Check-out"
								number={`${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`}
							/>
						)}
						{hasTrip && <IglooItemCard title="Trip Date" number={formatDate(booking.tripDate)} />}
						<IglooItemCard title="Guests" number={booking.guests} />
					</div>

					<div className="item-section__actions mt-3">
						<span className="action-icon" onClick={() => openModal(BookingsForm, { id: bookingId })}>
							<EditIcon />
						</span>
						<span
							className="action-icon"
							onClick={() =>
								openModal(DeleteConfirmation, { id: bookingId, category: 'booking', itemToDelete: booking })
							}>
							<DeleteIcon />
						</span>
					</div>
				</div>
			</div>
		</section>
	)
}

export default BookingsItem

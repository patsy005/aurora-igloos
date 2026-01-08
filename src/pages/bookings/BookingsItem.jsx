import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import SectionHeading from '../../components/SectionHeading'
import { contentArrayToMap, formatDate, getContentFromMap } from '../../utils/utils'
import { useModal } from '../../contexts/modalContext'
import BookingsForm from './BookingsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import ItemDetailsCard from '../../components/ItemDetailsCard'
import { useMemo } from 'react'

function BookingsItem() {
	const { bookingId } = useParams()
	const bookings = useSelector(state => state.bookings.bookings)
	const igloos = useSelector(state => state.igloos.igloos)
	const trips = useSelector(state => state.trips.trips)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const navigate = useNavigate()
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

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
			<SectionHeading sectionTitle={getContentFromMap(contentMap, 'bookingItem.heading', 'Booking')}></SectionHeading>

			<div className="item-section__overview section-box section-margin flex-md-row">
				<div className="item-img col-12 col-md-5 col-lg-4">
					{hasIgloo ? (
						<img src={`http://localhost:5212/${igloo.photoUrl}`} alt={igloo.name} />
					) : hasTrip ? (
						<img src={`http://localhost:5212/${trip.photoUrl}`} alt={trip.name} />
					) : (
						<p>{getContentFromMap(contentMap, 'common.noPhoto', 'No image available')}</p>
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
							<p className="promo uppercase-text">{getContentFromMap(contentMap, 'common.amount', 'Amount')}</p>
							<p className="promo-title mt-2">$ {booking.amount}</p>
						</div>
						<div>
							<div className="booking-type-badge">
								{hasIgloo && !hasTrip && <span>{getContentFromMap(contentMap, 'common.igloo', 'Igloo')}</span>}
								{!hasIgloo && hasTrip && <span>{getContentFromMap(contentMap, 'common.trip', 'Trip')}</span>}
								{hasIgloo && hasTrip && <span>{getContentFromMap(contentMap, 'common.both', 'Both')}</span>}
							</div>
						</div>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between flex-wrap flex-xxl-nowrap">
						<ItemDetailsCard
							title={getContentFromMap(contentMap, 'common.name', 'Name')}
							number={`${booking.customerName} ${booking.customerSurname}`}
						/>
						<ItemDetailsCard
							title={getContentFromMap(contentMap, 'common.email', 'Email')}
							number={booking.customerEmail}
						/>
						<ItemDetailsCard
							title={getContentFromMap(contentMap, 'common.phone', 'Phone')}
							number={booking.customerPhone}
						/>
						{hasIgloo && (
							<ItemDetailsCard
								title={getContentFromMap(contentMap, 'common.checkIn.checkOut', 'Check-In - Check-Out')}
								number={`${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`}
							/>
						)}
						{hasTrip && (
							<ItemDetailsCard
								title={getContentFromMap(contentMap, 'common.tripDate', 'Trip Date')}
								number={formatDate(booking.tripDate)}
							/>
						)}
						<ItemDetailsCard title={getContentFromMap(contentMap, 'common.guests', 'Guests')} number={booking.guests} />
					</div>

					<div className="item-section__actions mt-3">
						{canManage && (
							<span className="action-icon" onClick={() => openModal(BookingsForm, { id: bookingId })}>
								<EditIcon />
							</span>
						)}
						{canDelete && (
							<span
								className="action-icon"
								onClick={() =>
									openModal(DeleteConfirmation, { id: bookingId, category: 'booking', itemToDelete: booking })
								}>
								<DeleteIcon />
							</span>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

export default BookingsItem

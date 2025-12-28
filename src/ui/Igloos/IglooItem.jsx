/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import SectionHeading from '../../components/SectionHeading'
import { useEffect, useState } from 'react'
import DatePicker from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import IglooItemCard from './IglooItemCard'
import { DeleteIcon, EditIcon, GoBackIcon, StarIcon, ViewIcon } from '../Icons'
import IglooItemTable from './IglooItemTable'
import IglooReviewsList from './IglooReviewsList'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIgloos } from '../../slices/igloosSlice'
import { openModal } from '../../slices/modalSlice'
import { useModal } from '../../contexts/modalContext'
import IgloosForm from './IgloosForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'

const idMap = {
	1: 201,
	2: 202,
	3: 203,
	4: 204,
	5: 205,
	6: 201,
	7: 202,
}

function IglooItem() {
	const dispatch = useDispatch()
	const { iglooId } = useParams()
	const igloos = useSelector(state => state.igloos.igloos)
	const isFetchingIgloos = useSelector(state => state.igloos.isFetching)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const bookings = useSelector(state => state.bookings.bookings)
	// const bookings = data.bookings
	const navigate = useNavigate()
	const [datesState, setDatesState] = useState([])
	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchIgloos())
	}, [token])

	const igloo = igloos?.find(igloo => igloo.id === +iglooId)

	useEffect(() => {
		if (!igloo) return

		const iglooBookings = bookings.filter(b => b.iglooId === idMap[+iglooId])
		const bookingDates = iglooBookings.map(booking => ({
			checkIn: new Date(booking.checkInDate),
			checkOut: new Date(booking.checkOutDate),
		}))

		const dates = bookingDates.map(booking => [booking.checkIn, booking.checkOut])

		setDatesState(dates)
	}, [igloo, bookings, iglooId])

	console.log(igloos)

	console.log('dates:', datesState)

	console.log('bookings', bookings)

	const iglooDiscount = igloo?.discount ?? null

	return (
		<>
			{isFetchingIgloos ? (
				<p>Loading...</p>
			) : (
				<section className="item-section section mt-5">
					<span onClick={() => navigate(-1)} className="go-back">
						<GoBackIcon />
					</span>
					<p className="mt-4"></p>
					<SectionHeading sectionTitle="igloo"></SectionHeading>

					<div className="item-section__overview section-box section-margin flex-md-row">
						<div className="item-img col-12 col-md-5 col-lg-4">
							<img src={`http://localhost:5212/${igloo.photoUrl}`} alt={igloo.name} />
						</div>
						<div className="item-section__info col-12 col-md-7 justify-content-between">
							<h3 className="item-section__title">{igloo.name}</h3>
							<div className="item-section__promo">
								<p className="promo uppercase-text">
									annual promotion{' '}
									{iglooDiscount && (
										<span className="action-icon" onClick={() => navigate(`/promotions/${iglooDiscount.id}`)}>
											<ViewIcon />
										</span>
									)}
								</p>
								<p className="promo-title mt-2">{iglooDiscount ? iglooDiscount.name : '--'}</p>
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
										value={datesState}
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
								{canManage && (
									<span className="action-icon" onClick={() => openModal(IgloosForm, { id: iglooId })}>
										<EditIcon />
									</span>
								)}
								{canDelete && (
									<span
										className="action-icon"
										onClick={() =>
											openModal(DeleteConfirmation, { id: iglooId, category: 'igloo', itemToDelete: igloo })
										}>
										<DeleteIcon />
									</span>
								)}
							</div>
						</div>
					</div>

					{igloo && (
						<>
							<div className="section-margin user-item tasks">
								<h3>Bookings</h3>
								<IglooItemTable iglooId={iglooId} />
							</div>

							<div className="section-margin user-item tasks">
								<h3>Reviews</h3>
								<IglooReviewsList igloo={igloo} />
							</div>
						</>
					)}
				</section>
			)}
		</>
	)
}

export default IglooItem

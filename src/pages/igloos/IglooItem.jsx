/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { useNavigate, useParams } from 'react-router-dom'
import SectionHeading from '../../components/SectionHeading'
import { useEffect, useMemo, useState } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import { DeleteIcon, EditIcon, GoBackIcon, ViewIcon } from '../../ui/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIgloos } from '../../slices/igloosSlice'
import { useModal } from '../../contexts/modalContext'
import IgloosForm from './IgloosForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import { fetchBookings } from '../../slices/bookingsSlice'
import IglooItemTable from './IglooItemTable'
import ItemDetailsCard from '../../components/ItemDetailsCard'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import Spinner from '../../components/spinner/Spinner'

function IglooItem() {
	const dispatch = useDispatch()
	const { iglooId } = useParams()
	const igloos = useSelector(state => state.igloos.igloos)
	const isFetchingIgloos = useSelector(state => state.igloos.isFetching)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const bookings = useSelector(state => state.bookings.bookings)
	const navigate = useNavigate()
	const [datesState, setDatesState] = useState([])
	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchIgloos())
		dispatch(fetchBookings())
	}, [token])

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const igloo = igloos?.find(igloo => igloo.id === +iglooId)

	useEffect(() => {
		if (!iglooId || bookings.length === 0) return

		const iglooBookings = bookings.filter(b => b.idIgloo === Number(iglooId)).filter(b => b.checkIn && b.checkOut)

		const dates = iglooBookings.map(b => [
			new DateObject({ date: b.checkIn, format: 'YYYY-MM-DD' }),
			new DateObject({ date: b.checkOut, format: 'YYYY-MM-DD' }),
		])

		setDatesState(dates)
	}, [bookings, iglooId])

	const iglooDiscount = igloo?.discount ?? null

	return (
		<>
			{isFetchingIgloos ? (
				<Spinner className="page" />
			) : (
				<section className="item-section section mt-5">
					<span onClick={() => navigate(-1)} className="go-back">
						<GoBackIcon />
					</span>
					<p className="mt-4"></p>
					<SectionHeading sectionTitle={getContentFromMap(contentMap, 'iglooItem.heading', 'Igloo')}></SectionHeading>

					<div className="item-section__overview section-box section-margin flex-md-row">
						<div className="item-img col-12 col-md-5 col-lg-4">
							<img src={`http://localhost:5212/${igloo.photoUrl}`} alt={igloo.name} />
						</div>
						<div className="item-section__info col-12 col-md-7 justify-content-between">
							<h3 className="item-section__title">{igloo.name}</h3>
							<div className="item-section__promo">
								<p className="promo uppercase-text">
									{getContentFromMap(contentMap, 'common.promotion', 'Promotion')}:{' '}
									{iglooDiscount && (
										<span className="action-icon" onClick={() => navigate(`/promotions/${iglooDiscount.id}`)}>
											<ViewIcon />
										</span>
									)}
								</p>
								<p className="promo-title mt-2">{iglooDiscount ? iglooDiscount.name : '--'}</p>
							</div>
							<div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between">
								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'common.capacitty', 'Capacity')}
									number={igloo.capacity}
								/>
								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'iglooItem.price', 'Price per night')}
									number={`$ ${igloo.pricePerNight}`}
								/>
							</div>
							<div className="item-section__availability">
								<p className="uppercase-text mb-4 mt-3">
									{getContentFromMap(contentMap, 'iglooItem.availability', 'Availability')}
								</p>
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
								<h3>{getContentFromMap(contentMap, 'iglooItem.bookings.heading', 'Bookings')}</h3>
								<IglooItemTable iglooId={iglooId} />
							</div>
						</>
					)}
				</section>
			)}
		</>
	)
}

export default IglooItem

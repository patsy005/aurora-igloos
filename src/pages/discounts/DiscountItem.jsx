import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useState } from 'react'
import { fetchDiscounts } from '../../slices/discountsSlice'
import { fetchIgloos } from '../../slices/igloosSlice'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import SectionHeading from '../../components/SectionHeading'
import ItemDetailsCard from '../../components/ItemDetailsCard'
import DatePicker from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import DiscountsForm from './DiscountsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'

function DiscountItem() {
	const dispatch = useDispatch()
	const { discountId } = useParams()
	const igloos = useSelector(state => state.igloos.igloos)
	const discounts = useSelector(state => state.discounts.discounts)
	const isFetchingDiscounts = useSelector(state => state.discounts.isFetching)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const navigate = useNavigate()
	const promoIgloos = igloos.filter(igloo => igloo.idDiscount === +discountId)
	const { openModal } = useModal()
	const [dates, setDatesState] = useState([])

	useEffect(() => {
		if (!token) return
		dispatch(fetchDiscounts())
		dispatch(fetchIgloos())
	}, [token])

	const promotion = discounts?.find(promo => promo.id === +discountId)

	useEffect(() => {
		if (!promotion) return

		setDatesState([[promotion.validFrom, promotion.validTo]])
	}, [promotion])

	if (isFetchingDiscounts) {
		return <p>Loading discounts...</p>
	}

	if (!promotion) {
		return <p>Promotion not found</p>
	}

	return (
		<>
			<section className="item-section section mt-5">
				<span onClick={() => navigate(-1)} className="go-back">
					<GoBackIcon />
				</span>
				<p className="mt-4"></p>
				<SectionHeading sectionTitle="promotion"></SectionHeading>

				<div className="item-section__overview section-box section-margin flex-md-row promo-item">
					<div className="item-section__info col-12 ">
						<h3 className="item-section__title">{promotion.name}</h3>
						<div className="item-section__promo">
							<p className="promo uppercase-text">Description</p>
							<p className="promo-title mt-2">{promotion.description}</p>
						</div>
						<div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between col-12">
							<ItemDetailsCard title="Discount" number={promotion.discount} />
						</div>

						<div className="item-section__promo mt-3">
							<p className="promo uppercase-text">Igloos</p>
							<div className="item-section__promo--igloos my-3 d-flex gap-5 flex-wrap">
								{promoIgloos.map(igloo => {
									return (
										<div
											className="item-section__promo--igloo-box"
											key={igloo.id}
											onClick={() => navigate(`/igloos/${igloo.id}`)}>
											{igloo.name}
										</div>
									)
								})}
							</div>
						</div>

						<div className="item-section__availability">
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
									disableDayPicker
								/>
							</div>
						</div>

						<div className="item-section__actions mt-3">
							{canManage && (
								<span className="action-icon" onClick={() => openModal(DiscountsForm, { id: discountId })}>
									<EditIcon />
								</span>
							)}
							{canDelete && (
								<span
									className="action-icon"
									onClick={() =>
										openModal(DeleteConfirmation, { id: discountId, category: 'discount', itemToDelete: promotion })
									}>
									<DeleteIcon />
								</span>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	)
}

export default DiscountItem

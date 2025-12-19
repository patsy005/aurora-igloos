import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import PromotionsTable from './PromotionsTable'
import { setIsCreating } from '../../slices/promoSlice'
import Button from '../../components/Button'
import PromoForm from './PromoForm'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchDiscounts } from '../../slices/discountsSlice'
import { fetchIgloos } from '../../slices/igloosSlice'

function PromotionsView() {
	const dispatch = useDispatch()
	const discounts = useSelector(state => state.discounts.discounts)
	const { openModal } = useModal()

	useEffect(() => {
		dispatch(fetchDiscounts())
		dispatch(fetchIgloos())
	}, [])

	if (!discounts.length) return null

	const openAddDiscountModal = () => {
		openModal(PromoForm)
	}

	return (
		<>
			<SectionHeading sectionTitle="discounts" />
			<div className="text-end">
				<Button onClick={openAddDiscountModal}>Add discount</Button>
			</div>
			<PromotionsTable />
		</>
	)
}

export default PromotionsView

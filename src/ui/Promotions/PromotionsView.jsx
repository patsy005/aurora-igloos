import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import PromotionsTable from './PromotionsTable'
import Button from '../../components/Button'
import PromoForm from './PromoForm'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchDiscounts } from '../../slices/discountsSlice'
import { fetchIgloos } from '../../slices/igloosSlice'
import { selectCanManage } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'

function PromotionsView() {
	const dispatch = useDispatch()
	const discounts = useSelector(state => state.discounts.discounts)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetchingDiscounts = useSelector(state => state.discounts.isFetchingDiscounts)
	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchDiscounts())
		dispatch(fetchIgloos())
	}, [token])

	if (!discounts.length) return null

	const openAddDiscountModal = () => {
		openModal(PromoForm)
	}

	if (isFetchingDiscounts) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle="discounts" />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddDiscountModal}>Add discount</Button>
				</div>
			)}
			<PromotionsTable />
		</>
	)
}

export default PromotionsView

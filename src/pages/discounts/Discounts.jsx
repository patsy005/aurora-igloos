import { useDispatch, useSelector } from 'react-redux'
import { selectCanManage } from '../../slices/authSlice'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchDiscounts } from '../../slices/discountsSlice'
import { fetchIgloos } from '../../slices/igloosSlice'
import Spinner from '../../components/spinner/Spinner'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import DiscountsTable from './DiscountsTable'
import DiscountsForm from './DiscountsForm'

function Discounts() {
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
		openModal(DiscountsForm)
	}

	if (isFetchingDiscounts) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle="Discounts" />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddDiscountModal}>Add discount</Button>
				</div>
			)}
			<DiscountsTable />
		</>
	)
}

export default Discounts

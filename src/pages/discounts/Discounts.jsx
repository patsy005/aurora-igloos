import { useDispatch, useSelector } from 'react-redux'
import { selectCanManage } from '../../slices/authSlice'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { fetchDiscounts } from '../../slices/discountsSlice'
import { fetchIgloos } from '../../slices/igloosSlice'
import Spinner from '../../components/spinner/Spinner'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import DiscountsTable from './DiscountsTable'
import DiscountsForm from './DiscountsForm'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function Discounts() {
	const dispatch = useDispatch()
	const discounts = useSelector(state => state.discounts.discounts)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetchingDiscounts = useSelector(state => state.discounts.isFetching)
	const content = useSelector(state => state.contentBlocks.items)
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

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
			<SectionHeading sectionTitle={getContentFromMap(contentMap, 'discounts.heading', 'Discounts')} />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddDiscountModal}>{getContentFromMap(contentMap, 'discounts.cta', 'Add discount')}</Button>
				</div>
			)}
			<DiscountsTable />
		</>
	)
}

export default Discounts

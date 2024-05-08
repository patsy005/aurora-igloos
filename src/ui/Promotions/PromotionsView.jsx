import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../SectionHeading'
import PromotionsTable from './PromotionsTable'
import { setIsCreating } from '../../slices/promoSlice'
import Button from '../Button'
import PromoForm from './PromoForm'

function PromotionsView() {
	const isCreating = useSelector(state => state.promo.isCreating)
	const dispatch = useDispatch()

	const handleAddPromo = () => {
		dispatch(setIsCreating(true))
	}
	return (
		<>
			<SectionHeading sectionTitle="promotions" />
			<div className="text-end">{!isCreating && <Button onClick={handleAddPromo}>Add promotion</Button>}</div>
			{isCreating && <PromoForm />}
			<PromotionsTable />
		</>
	)
}

export default PromotionsView

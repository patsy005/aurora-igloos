import { useDispatch, useSelector } from 'react-redux'
import { setIsCreating } from '../../slices/customersSLice'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import CustomersForm from './CustomersForm'
import CustomersTable from './CustomersTable'

function CustomersView() {
	const isCreating = useSelector(state => state.customers.isCreating)
	const dispatch = useDispatch()

	const handleAddBooking = () => {
		dispatch(setIsCreating(true))
	}
	return (
		<>
			<SectionHeading sectionTitle="cutomers" />
			<div className="text-end">{!isCreating && <Button onClick={handleAddBooking}>Add customer</Button>}</div>
			{isCreating && <CustomersForm />}
			<CustomersTable />
		</>
	)
}

export default CustomersView

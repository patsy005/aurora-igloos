import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchCustomers } from '../../slices/customersSLice'
import CustomersForm from './CustomersForm'
import Button from '../../components/Button'
import CustomersTable from './CustomersTable'

function Customers() {
	const dispatch = useDispatch()
	const customers = useSelector(state => state.customers.customers)
	const { openModal } = useModal()

	useEffect(() => {
		dispatch(fetchCustomers())
	}, [])

	if (!customers.length) return null

	const openAddCustomerModal = () => {
		openModal(CustomersForm)
	}
	return (
		<>
			<SectionHeading sectionTitle="Customers" />
			<div className="text-end">
				<Button onClick={openAddCustomerModal}>Add customer</Button>
			</div>
			<CustomersTable />
		</>
	)
}

export default Customers

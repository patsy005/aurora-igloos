import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchCustomers } from '../../slices/customersSLice'
import CustomersForm from './CustomersForm'
import Button from '../../components/Button'
import CustomersTable from './CustomersTable'
import { selectCanManage } from '../../slices/authSlice'

function Customers() {
	const dispatch = useDispatch()
	const customers = useSelector(state => state.customers.customers)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)

	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchCustomers())
	}, [token])

	if (!customers.length) return null

	const openAddCustomerModal = () => {
		openModal(CustomersForm)
	}
	return (
		<>
			<SectionHeading sectionTitle="Customers" />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddCustomerModal}>Add customer</Button>
				</div>
			)}
			<CustomersTable />
		</>
	)
}

export default Customers

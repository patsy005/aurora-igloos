import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { fetchCustomers } from '../../slices/customersSLice'
import CustomersForm from './CustomersForm'
import Button from '../../components/Button'
import CustomersTable from './CustomersTable'
import { selectCanManage } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function Customers() {
	const dispatch = useDispatch()
	const customers = useSelector(state => state.customers.customers)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetching = useSelector(state => state.customers.isFetching)
	const content = useSelector(state => state.contentBlocks.items)

	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	useEffect(() => {
		if (!token) return
		dispatch(fetchCustomers())
	}, [token])

	if (!customers.length) return null

	const openAddCustomerModal = () => {
		openModal(CustomersForm)
	}

	if (isFetching) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle={getContentFromMap(contentMap, 'customers.heading', 'Customers')} />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddCustomerModal}>{getContentFromMap(contentMap, 'customers.cta', 'Add customer')}</Button>
				</div>
			)}
			<CustomersTable />
		</>
	)
}

export default Customers

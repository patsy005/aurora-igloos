import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { fetchBookings } from '../../slices/bookingsSlice'
import BookingsForm from './BookingsForm'
import SectionHeading from '../../components/SectionHeading'
import BookingsTable from './BookingsTable'
import Button from '../../components/Button'
import { fetchPaymentMethods } from '../../slices/paymentMethodSlice'
import { fetchEmployees } from '../../slices/employeesSlice'
import { fetchIgloos } from '../../slices/igloosSlice'
import { fetchTrips } from '../../slices/tripsSlice'
import { fetchCustomers } from '../../slices/customersSLice'
import { selectCanManage } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function Bookings() {
	const dispatch = useDispatch()
	const bookings = useSelector(state => state.bookings.bookings)
	const isFetching = useSelector(state => state.bookings.isFetching)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const content = useSelector(state => state.contentBlocks.items)
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	useEffect(() => {
		if (!token) return
		dispatch(fetchBookings())
		dispatch(fetchPaymentMethods())
		dispatch(fetchEmployees())
		dispatch(fetchIgloos())
		dispatch(fetchTrips())
		dispatch(fetchCustomers())
	}, [token])

	if (!bookings.length) return null

	const openAddBookingModal = () => {
		openModal(BookingsForm)
	}

	if (isFetching) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle={getContentFromMap(contentMap, 'bookings.heading', 'Bookings')} />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddBookingModal}>{getContentFromMap(contentMap, 'bookings.cta', 'Add booking')} </Button>
				</div>
			)}
			<BookingsTable />
		</>
	)
}

export default Bookings

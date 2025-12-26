import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
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

function Bookings() {
	const dispatch = useDispatch()
	const bookings = useSelector(state => state.bookings.bookings)
	const { openModal } = useModal()

	useEffect(() => {
		dispatch(fetchBookings())
		dispatch(fetchPaymentMethods())
		dispatch(fetchEmployees())
		dispatch(fetchIgloos())
		dispatch(fetchTrips())
		dispatch(fetchCustomers())
	}, [])

	if (!bookings.length) return null

	console.log('bookings:', bookings)

	const openAddBookingModal = () => {
		openModal(BookingsForm)
	}

	return (
		<>
			<SectionHeading sectionTitle="Bookings" />
			<div className="text-end">
				<Button onClick={openAddBookingModal}>Add booking</Button>
			</div>
			<BookingsTable />
		</>
	)
}

export default Bookings

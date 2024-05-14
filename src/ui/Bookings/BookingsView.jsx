import { useState } from 'react'
import Button from '../../components/Button'
import SectionHeading from '../../components/SectionHeading'
import BookingsForm from './BookingsForm'
import BookingsTable from './BookingsTable'
import { useDispatch, useSelector } from 'react-redux'
import { setIsCreating } from '../../slices/bookings'
import BookingsTodayStats from './BookingsTodayStats'

function BookingsView() {
	// const [isCreating, setIsCreating] = useState(false)
	// const [isEditing, setIsEditing] = useState(false)
	const isCreating = useSelector(state => state.bookings.isCreating)
	const dispatch = useDispatch()

	const handleAddBooking = () => {
		dispatch(setIsCreating(true))
	}
	return (
		<>
			<SectionHeading sectionTitle="bookings" />
			<BookingsTodayStats />
			<div className="text-end">{!isCreating && <Button onClick={handleAddBooking}>Add booking</Button>}</div>
			{isCreating && <BookingsForm setIsCreating={setIsCreating} />}
			<BookingsTable />
		</>
	)
}

export default BookingsView

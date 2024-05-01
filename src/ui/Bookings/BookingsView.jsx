import { useState } from 'react'
import Button from '../Button'
import SectionHeading from '../SectionHeading'
import BookingsForm from './BookingsForm'
import BookingsTable from './BookingsTable'

function BookingsView() {
	const [isCreating, setIsCreating] = useState(false)

	const handleAddBooking = () => {
		setIsCreating(true)
	}
	return (
		<>
			<SectionHeading sectionTitle="bookings" />
			<div className="text-end">{!isCreating && <Button onClick={handleAddBooking}>Add booking</Button>}</div>
			{isCreating && <BookingsForm setIsCreating={setIsCreating} />}
            <BookingsTable />
		</>
	)
}

export default BookingsView

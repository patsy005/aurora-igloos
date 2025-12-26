import { useSelector } from 'react-redux'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import Table from '../../ui/Table/Table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import BookingsForm from './BookingsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'

function BookingsTable() {
	const bookings = useSelector(state => state.bookings.bookings)
	const [data, setData] = useState(bookings)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const { openModal } = useModal()

	const setBookingsCallback = useCallback(() => {
		setData(bookings)
	}, [bookings])

	useEffect(() => {
		setBookingsCallback()
	}, [bookings, setBookingsCallback])

	const openEditBookingModal = bookingId => {
		openModal(BookingsForm, { id: bookingId })
	}

	const openDeleteBookingModal = bookingId => {
		const itemToDelete = bookings.find(i => i.id === +bookingId)
		openModal(DeleteConfirmation, { id: bookingId, category: 'booking', itemToDelete: itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: 'Igloo',
				id: 'bookings.igloo',
				accessorKey: 'iglooId',
				cell: ({ row }) => {
					const igloo = row.original.iglooName ? row.original.iglooName : '-'
					// const igloo = igloos.find(igloo => row.original.idIgloo === igloo.id)
					return <div className="bookings-table__igloo">{igloo}</div>
				},
			},
			{
				header: 'Trip',
				id: 'bookings.trip',
				accessorKey: 'trip',
				cell: ({ row }) => {
					const trip = row.original.tripName ?? '-'
					return <div className="bookings-table__trip">{trip}</div>
				},
			},
			{
				header: 'Guest',
				id: 'bookings.guest',
				accessorKey: 'customerId',
				cell: ({ row }) => {
					// const customer = customers.find(customer => row.original.customerId === customer.id)
					return (
						<div className="bookings-table__guest">
							<span className="name">
								{row.original.customerName} {row.original.customerSurname}
							</span>
							<span className="email">{row.originalcustomerEmail}</span>
						</div>
					)
				},
			},
			{
				header: 'Dates',
				id: 'bookings.dates',
				accessorKey: 'checkInDate checkOutDate',
				cell: ({ row }) => {
					const { checkIn, checkOut, tripDate, idIgloo, tripId } = row.original

					const hasIglooBooking = idIgloo !== null && idIgloo !== undefined
					const hasTripBooking = tripId !== null && tripId !== undefined

					if (hasIglooBooking && hasTripBooking) {
						return (
							<div className="bookings-table__dates">
								<div>
									<strong>Igloo:</strong> {checkIn} - {checkOut}
								</div>
								<div>
									<strong>Trip:</strong> {tripDate}
								</div>
							</div>
						)
					}

					if (hasIglooBooking) {
						return (
							<div className="bookings-table__dates">
								{checkIn} - {checkOut}
							</div>
						)
					}

					if (hasTripBooking) {
						return <div className="bookings-table__dates">{tripDate}</div>
					}

					return <div className="bookings-table__dates">-</div>
				},
			},
			{
				header: 'Amount',
				id: 'bookings.amount',
				accessorKey: 'amount',
				cell: ({ row }) => {
					return <div className="bookings-table__amount">$ {row.original.amount}</div>
				},
			},
			// {
			// 	header: 'Status',
			// 	id: bookings.id,
			// 	accessorKey: 'status',
			// 	cell: ({ row }) => {
			// 		const hasChecked = row.original.status === 'in' || row.original.status === 'out'
			// 		return (
			// 			<div className={`status status__${row.original.status}`}>
			// 				{hasChecked && 'checked '}
			// 				{row.original.status}
			// 			</div>
			// 		)
			// 	},
			// },
			{
				header: '',
				accessorKey: 'bookings.actions',
				className: '',
				id: 'actions',
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions">
							<span onClick={() => openEditBookingModal(row.original.id)}>
								<EditIcon />
							</span>
							<span onClick={() => navigate(`/bookings/${row.original.id}`)}>
								<ViewIcon />
							</span>
							<span className="delete-icon" onClick={() => openDeleteBookingModal(row.original.id)}>
								<DeleteIcon />
							</span>
						</div>
					)
				},
			},
		],
		[bookings, navigate]
	)

	return (
		<Table
			data={data}
			columnFilters={columnFilters}
			pagination={pagination}
			setData={setData}
			setPagination={setPagination}
			columns={columns}
			setColumnFilters={setColumnFilters}
		/>
	)
}

export default BookingsTable

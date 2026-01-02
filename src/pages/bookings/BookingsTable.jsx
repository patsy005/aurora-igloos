import { useSelector } from 'react-redux'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import Table from '../../components/Table/Table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import BookingsForm from './BookingsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import SearchInput from '../../components/SearchInput'

function BookingsTable() {
	const bookings = useSelector(state => state.bookings.bookings)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const [data, setData] = useState(bookings)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
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
				accessorKey: 'iglooName',
				cell: ({ row }) => {
					const igloo = row.original.iglooName ? row.original.iglooName : '-'
					return <div className="bookings-table__igloo">{igloo}</div>
				},
			},
			{
				header: 'Trip',
				id: 'bookings.trip',
				accessorKey: 'tripName',
				cell: ({ row }) => {
					const trip = row.original.tripName ?? '-'
					return <div className="bookings-table__trip">{trip}</div>
				},
			},
			{
				header: 'Guest',
				id: 'bookings.guest',
				accessorFn: row => `${row.customerName ?? ''} ${row.customerSurname ?? ''} ${row.customerEmail ?? ''}`.trim(),
				cell: ({ row }) => {
					return (
						<div className="bookings-table__guest">
							<span className="name">
								{row.original.customerName} {row.original.customerSurname}
							</span>
							<span className="email">{row.original.customerEmail}</span>
						</div>
					)
				},
			},
			{
				header: 'Dates',
				id: 'bookings.dates',
				accessorFn: row => `${row.checkIn ?? ''} ${row.checkOut ?? ''} ${row.tripDate ?? ''}`.trim(),
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
			{
				header: '',
				accessorKey: 'bookings.actions',
				className: '',
				id: 'actions',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions">
							{canManage && (
								<span onClick={() => openEditBookingModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							<span onClick={() => navigate(`/bookings/${row.original.id}`)}>
								<ViewIcon />
							</span>
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteBookingModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[bookings, navigate]
	)

	return (
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder="Search booking..." />
			</div>
			<Table
				data={data}
				columnFilters={columnFilters}
				pagination={pagination}
				setData={setData}
				setPagination={setPagination}
				columns={columns}
				setColumnFilters={setColumnFilters}
				globalFilter={globalFilter}
				setGlobalFilter={setGlobalFilter}
			/>
		</>
	)
}

export default BookingsTable

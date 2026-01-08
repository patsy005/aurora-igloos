import { useSelector } from 'react-redux'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import { useMemo, useState, useEffect } from 'react'
import { useModal } from '../../contexts/modalContext'
import BookingsForm from '../bookings/BookingsForm'
import { DeleteIcon, EditIcon } from '../../ui/Icons'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import Table from '../../components/Table/Table'
import Spinner from '../../components/spinner/Spinner'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import { get } from 'react-hook-form'

function IglooItemTable({ iglooId }) {
	const bookings = useSelector(state => state.bookings?.bookings ?? [])
	const isFetchingBookings = useSelector(state => state.bookings?.isFetching)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)

	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const iglooBookings = useMemo(() => {
		return bookings.filter(b => b.idIgloo === Number(iglooId))
	}, [bookings, iglooId])

	const [data, setData] = useState([])

	useEffect(() => {
		setData(iglooBookings)
	}, [iglooBookings])

	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

	const columns = useMemo(
		() => [
			{
				header: getContentFromMap(contentMap, 'iglooItemTable.guestHeader', 'Guest'),
				id: 'guest',
				accessorFn: row => `${row.customerName ?? ''} ${row.customerSurname ?? ''} ${row.customerEmail ?? ''}`,
				cell: ({ row }) => (
					<div className="bookings-table__guest">
						<span className="name">
							{row.original.customerName} {row.original.customerSurname}
						</span>
						<span className="email">{row.original.customerEmail}</span>
					</div>
				),
			},
			{
				header: getContentFromMap(contentMap, 'common.dates', 'Dates'),
				id: 'dates',
				accessorFn: row => `${row.checkIn ?? ''}-${row.checkOut ?? ''}`,
				cell: ({ row }) => (
					<div className="bookings-table__dates">{`${row.original.checkIn} - ${row.original.checkOut}`}</div>
				),
			},
			{
				header: getContentFromMap(contentMap, 'common.amount', 'Amount'),
				id: 'amount',
				accessorKey: 'amount',
				cell: ({ row }) => <div className="bookings-table__amount">$ {row.original.amount}</div>,
			},
			{
				header: '',
				id: 'actions',
				enableGlobalFilter: false,
				cell: ({ row }) => (
					<div className="bookings-table__actions">
						{canManage && (
							<span className="action-icon" onClick={() => openModal(BookingsForm, { id: row.original.id })}>
								<EditIcon />
							</span>
						)}
						{canDelete && (
							<span
								className="action-icon"
								onClick={() =>
									openModal(DeleteConfirmation, {
										id: row.original.id,
										category: 'booking',
										itemToDelete: row.original,
									})
								}>
								<DeleteIcon />
							</span>
						)}
					</div>
				),
			},
		],
		[canDelete, canManage, openModal]
	)

	if (isFetchingBookings) return <Spinner className="form" />

	if (!isFetchingBookings && data.length === 0) return <p className="mt-3">No bookings for this igloo.</p>

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

export default IglooItemTable

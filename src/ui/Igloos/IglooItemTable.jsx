import { useEffect, useMemo, useState } from 'react'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon } from '../Icons'
import Table from '../Table/Table'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import { useModal } from '../../contexts/modalContext'
import IgloosForm from './IgloosForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import BookingsForm from '../../pages/bookings/BookingsForm'

function IglooItemTable({ iglooId }) {
	const bookings = useSelector(state => state.bookings?.bookings ?? [])

	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)

	const iglooBookings = useMemo(() => {
		return (bookings ?? []).filter(b => b.idIgloo === Number(iglooId))
	}, [bookings, iglooId])

	const [data, setData] = useState(iglooBookings)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const { openModal } = useModal()

	const columns = useMemo(() => [
		{
			header: 'Guest',
			id: bookings.id,
			accessorKey: 'customerId',
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
			id: bookings.id,
			accessorKey: 'checkInDate checkOutDate',
			cell: ({ row }) => {
				return <div className="bookings-table__dates">{`${row.original.checkIn} - ${row.original.checkOut}`}</div>
			},
		},
		{
			header: 'Amount',
			id: bookings.id,
			accessorKey: 'amount',
			cell: ({ row }) => {
				return <div className="bookings-table__amount">$ {row.original.amount}</div>
			},
		},
		{
			header: '',
			accessorKey: 'id',
			className: '',
			id: bookings.id,
			cell: ({ row }) => {
				console.log('row:', row.original)
				return (
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
										id: iglooId,
										category: 'igloo',
										itemToDelete: iglooBookings.find(i => i.id === +iglooId),
									})
								}>
								<DeleteIcon />
							</span>
						)}
					</div>
				)
			},
		},
	], [canDelete, canManage, iglooBookings, iglooId, openModal])
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

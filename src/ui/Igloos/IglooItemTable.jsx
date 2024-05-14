import { useMemo, useState } from 'react'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon } from '../Icons'
import Table from '../Table/Table'
import { useNavigate } from 'react-router-dom'

const bookings = data.bookings
const customers = data.customers
const igloos = data.igloos

function IglooItemTable({ iglooId }) {
	const iglooBookings = bookings.filter(booking => booking.iglooId === +iglooId)
	console.log(iglooBookings)
	const [data, setData] = useState(iglooBookings)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()

	const columns = useMemo(() => [
		{
			header: 'Guest',
			id: bookings.id,
			accessorKey: 'customerId',
			cell: ({ row }) => {
				const customer = customers.find(customer => row.original.customerId === customer.id)
				return (
					<div className="bookings-table__guest">
						<span className="name">
							{customer.name} {customer.surname}
						</span>
						<span className="email">{customer.email}</span>
					</div>
				)
			},
		},
		{
			header: 'Dates',
			id: bookings.id,
			accessorKey: 'checkInDate checkOutDate',
			cell: ({ row }) => {
				return (
					<div className="bookings-table__dates">{`${row.original.checkInDate} - ${row.original.checkOutDate}`}</div>
				)
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
			header: 'Status',
			id: bookings.id,
			accessorKey: 'status',
			cell: ({ row }) => {
				const hasChecked = row.original.status === 'in' || row.original.status === 'out'
				return (
					<div className={`status status__${row.original.status} status-item-section`}>
						{hasChecked && 'checked '}
						{row.original.status}
					</div>
				)
			},
		},
		{
			header: '',
			accessorKey: 'id',
			className: '',
			id: bookings.id,
			cell: ({ row }) => {
				return (
					<div className="bookings-table__actions">
						<span onClick={() => navigate(`/bookings/${row.original.id}/edit`)}>
							<EditIcon />
						</span>
						<span>
							<DeleteIcon />
						</span>
					</div>
				)
			},
		},
	])
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

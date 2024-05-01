import { useMemo } from 'react'
import data from '../../../public/data.json'
import { EditIcon } from '../Icons'
import Table from '../Table/Table'

function BookingsTable() {
	const bookings = data.bookings
	const customers = data.customers
	const igloos = data.igloos

	const columns = useMemo(() => [
		{
			Header: 'Igloo',
			accessor: 'iglooId',
			className: 'bookings-table__igloo',
			Cell: ({ row }) => {
				const igloo = igloos.find(igloo => row.original.iglooId === igloo.id)
				return <div>{igloo.name}</div>
			},
		},
		{
			Header: 'Guest',
			accessor: 'customerId',
			className: 'b',
			Cell: ({ row }) => {
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
			Header: 'Dates',
			accessor: 'checkInDate checkOutDate',
			className: 'bookings-table__dates',
			Cell: ({ row }) => {
				return <div>{`${row.original.checkInDate} - ${row.original.checkOutDate}`}</div>
			},
		},
		{
			Header: 'Amount',
			accessor: 'amount',
			className: 'bookings-table__amount',
			Cell: ({ row }) => {
				return <div>$ {row.original.amount}</div>
			},
		},
		{
			Header: 'Status',
			accessor: 'status',
			className: 'bookings-table__status',
			Cell: ({ row }) => {
				const hasChecked = row.original.status === 'in' || row.original.status === 'out'
				return (
					<div className={row.original.status}>
						{hasChecked && 'checked '}
						{row.original.status}
					</div>
				)
			},
		},
		{
			Header: '',
			accessor: 'id',
			className: '',
			Cell: ({ row }) => {
				return (
					<div>
						<EditIcon />
					</div>
				)
			},
		},
	])
	return (
		<div className="col-12 overflow-x-scroll mt-5 table-container">
			{bookings.length > 0 && <Table columns={columns} totalRows={bookings.length} data={bookings} />}
		</div>
	)
}

export default BookingsTable

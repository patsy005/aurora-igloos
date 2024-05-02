
import { useState } from 'react'
import data from '../../../public/data.json'
import { EditIcon } from '../Icons'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import Pagination from '../Table/Pagination'

const bookings = data.bookings
const customers = data.customers
const igloos = data.igloos

const columns = [
	{
		header: 'Igloo',
		id: bookings.id,
		accessorKey: 'iglooId',
		cell: ({ row }) => {
			const igloo = igloos.find(igloo => row.original.iglooId === igloo.id)
			return <div className="bookings-table__igloo">{igloo.name}</div>
		},
	},
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
			return <div className="bookings-table__dates">{`${row.original.checkInDate} - ${row.original.checkOutDate}`}</div>
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
				<div className={`status status__${row.original.status}`}>
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
				<div>
					<EditIcon />
				</div>
			)
		},
	},
]

function BookingsTable() {
	const [data, setData] = useState(bookings)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters,
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: 'onChange',
		onPaginationChange: setPagination,
		meta: {
			updateData: (rowIndex, columnId, value) => {
				setData(prev => {
					prev.map((row, index) => (index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row))
				})
			},
		},
	})

	return (
		<div className="col-12 overflow-x-scroll mt-5 table-container">
			<table className="table table-hover">
				{table.getHeaderGroups().map(headerGroup => (
					<thead key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<th key={header.id}>
								{header.column.columnDef.header}
								{/* {header.column.getCanSort() && <button onClick={header.column.getToggleSortingHandler()} />} */}
								{/* {
									{
										asc: ' 🔼',
										desc: ' 🔽',
									}[header.column.getIsSorted()]
								} */}
								{/* <div
									onMouseDown={header.getResizeHandler()}
									onTouchStart={header.getResizeHandler()}
									className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
								/> */}
							</th>
						))}
					</thead>
				))}
				<tbody>
					{table.getRowModel().rows.map(row => (
						<tr key={row.id}>
							{row.getVisibleCells().map(cell => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			{/* <p>
				Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
			</p>
			<div>
				<button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
					{'<'}
				</button>
				<button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					{'>'}
				</button>
			</div> */}
			<Pagination table={table} />
		</div>
	)
}

export default BookingsTable

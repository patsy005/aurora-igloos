// import * as React from 'react'
// import { DataGrid } from '@mui/x-data-grid'
// import data from '../../../public/data.json'
// import { styled } from '@mui/material/styles'

// const bookings = data.bookings
// const customers = data.customers
// const igloos = data.igloos

// const columns = [
// 	{ field: 'iglooName', headerName: 'Igloo', width: 150 },
// 	{ field: 'customerName', headerName: 'Guest', width: 150 },
// 	{ field: 'dates', headerName: 'Dates', width: 150 },
// 	{ field: 'amount', headerName: 'Amount', width: 150 },
// 	{ field: 'status', headerName: 'Status', width: 150 },
// 	{ field: 'edit', headerName: '', width: 150 },
// ]

// const rows = bookings.map(booking => {
// 	const customer = customers.find(customer => customer.id === booking.customerId)
// 	const igloo = igloos.find(igloo => igloo.id === booking.iglooId)
// 	return {
// 		id: booking.id,
// 		iglooName: igloo.name,
// 		customerName: `${customer.name} ${customer.surname} ${customer.email}`,
// 		// dates: booking.dates,
// 		dates: `${booking.startDate} - ${booking.endDate}`,
// 		amount: booking.amount,
// 		status: booking.status,
// 		edit: 'edit',
// 	}
// })

// function BookingsTable() {
// 	return (
// 		<div style={{ height: '100%', width: '100%' }} className='mt-5 table-head'>
// 			<DataGrid
// 				rows={rows}
// 				columns={columns}
// 				initialState={{
// 					pagination: {
// 						paginationModel: { page: 0, pageSize: 5 },
// 					},
// 				}}
// 				pageSizeOptions={[5, 10]}
// 			/>
// 		</div>
// 	)
// }

// export default BookingsTable



// tanstack



// import { useMemo, useState } from 'react'
// import dataJson from '../../../public/data.json'
// import useFilter from '../../hooks/useFilter'
// import Table from '../Table/Table'

// const bookings = dataJson.bookings

// function BookingsTable({ callback }) {
// 	const customers = dataJson.customers
// 	const igloos = dataJson.igloos

// 	const [currentPage, setCurrentPage] = useState(1)
// 	const [pageSize, setPageSize] = useState(8)
// 	const [sortBy, setSortBy] = useState([])

// 	const filterTypes = [
// 		{
// 			type: 'multichoice',
// 			key: 'state',
// 			label: 'State',
// 			choices: [
// 				{ label: 'All', value: 'all' },
// 				{ label: 'Unconfirmed', value: 'unconfirmed' },
// 				{ label: 'Confirmed', value: 'confirmed' },
// 				{ label: 'Checked-in', value: 'checked-in' },
// 				{ label: 'Checked-out', value: 'checked-out' },
// 			],
// 		},
// 	]

// 	const { activeFilters, addFilter, removeFilter, changeFilterValue, replaceFilter, updateSearchFilter } = useFilter([
// 		{ state: '' },
// 		'bookings',
// 	])

// 	const columns = useMemo(() => [
// 		{
// 			Header: 'Igloo',
// 			accessor: 'iglooId',
// 			className: '',
// 			Cell: ({ row }) => {
// 				const igloo = igloos.find(igloo => row.original.iglooId === igloo.id)
// 				return <div>{igloo.name}</div>
// 			},
// 		},
// 		{
// 			Header: 'Guest',
// 			accessor: 'userId',
// 			className: '',
// 			Cell: ({ row }) => {
// 				const customer = customers.find(customer => row.original.customerId === customer.id)
// 				return (
// 					<div>
// 						<span>
// 							{customer.name} {customer.surname}
// 						</span>
// 						<span>{customer.email}</span>
// 					</div>
// 				)
// 			},
// 		},
//         {
//             Header: 'Dates',
//             accessor: 'checkInDate checkOutDate',
//             className: '',
//             Cell: ({ row }) => {
//                 return <div>{`${row.original.checkInDate} - ${row.original.checkOutDate}`}</div>
//             },

//         },
//         {
//             Header: 'Amount',
//             accessor: 'amount',
//             className: '',
//             Cell: ({ row }) => {
//                 return <div>{row.original.amount}</div>
//             },
//         },
//         {
//             Header: 'Status',
//             accessor: 'status',
//             className: '',
//             Cell: ({ row }) => {
//                 return <div>{row.original.status}</div>
//             },
//         }

// 	])
// 	return (
// 		<Table
// 			columns={columns}
// 			data={bookings}
// 			totalRows={bookings.length}
// 			currentPage={currentPage}
// 			setCurrentPage={setCurrentPage}
// 			pageChangeHandler={(page, size) => {
// 				setCurrentPage(page)
// 				setPageSize(size)
// 			}}
// 		/>
// 	)
// }

// export default BookingsTable

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import CustomersForm from './CustomersForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import Table from '../../ui/Table/Table'

function CustomersTable() {
	const customers = useSelector(state => state.customers.customers)
	const [data, setData] = useState(customers)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const { openModal } = useModal()

	const setCustomersCallback = useCallback(() => {
		setData(customers)
	}, [customers])

	useEffect(() => {
		setCustomersCallback()
	}, [customers, setCustomersCallback])

	const openEditCustomerModal = customerId => {
		openModal(CustomersForm, { id: customerId })
	}

	const openDeleteCustomerModal = customerId => {
		const itemToDelete = customers.find(i => i.id === +customerId)
		openModal(DeleteConfirmation, { id: customerId, category: 'customer', itemToDelete })
	}

	const columns = useMemo(() => [
		{
			header: 'Name',
			id: 'customers_name',
			accessorKey: 'name',
			cell: ({ row }) => {
				return (
					<div className="bookings-table__guest">
						<span className="name">
							{row.original.name} {row.original.surname}
						</span>
						<span className="email">{row.original.email}</span>
					</div>
				)
			},
		},
		{
			header: 'Phone',
			id: 'customers_phone',
			accessorKey: 'phone',
			cell: ({ row }) => {
				return <div className="customers-table__phone">{row.original.phone}</div>
			},
		},
		{
			header: 'Has account',
			id: 'customers_hasAccount',
			accessorKey: 'hasAccount',
			cell: ({ row }) => {
				return <div className="customers-table__has-account">{row.original.createUser ? 'Yes' : 'No'}</div>
			},
		},
		// {
		// 	header: 'Nationality',
		// 	id: customers.id,
		// 	accessorKey: 'nationality',
		// 	cell: ({ row }) => {
		// 		return <div className="customers-table__nationality">{row.original.nationality}</div>
		// 	},
		// },
		// {
		// 	header: 'Bookings',
		// 	id: customers.id,
		// 	accessorKey: 'bookings',
		// 	cell: ({ row }) => {
		// 		const customerBookingId = bookings.find(booking => booking.customerId === row.original.id).id
		// 		return (
		// 			<div className="igloos-table__actions">
		// 				<span onClick={() => navigate(`/bookings/${customerBookingId}`)}>
		// 					<ViewIcon />
		// 				</span>
		// 			</div>
		// 		)
		// 	},
		// },
		// {
		// 	header: 'Status',
		// 	id: customers.id,
		// 	accessorKey: 'status',
		// 	cell: ({ row }) => {
		// 		const bookingStatus = bookings.find(booking => booking.customerId === row.original.id).status
		// 		const hasChecked = bookingStatus === 'in' || row.original.status === 'out'
		// 		return (
		// 			<div className={`status status__${bookingStatus}`}>
		// 				{hasChecked && 'checked '}
		// 				{bookingStatus}
		// 			</div>
		// 		)
		// 	},
		// },
		{
			header: '',
			accessorKey: 'id',
			className: '',
			id: customers.id,
			cell: ({ row }) => {
				return (
					<div className="bookings-table__actions">
						<span onClick={() => openEditCustomerModal(row.original.id)}>
							<EditIcon />
						</span>
						<span onClick={() => navigate(`/customers/${row.original.id}`)}>
							<ViewIcon />
						</span>
						<span className="delete-icon" onClick={() => openDeleteCustomerModal(row.original.id)}>
							<DeleteIcon />
						</span>
					</div>
				)
			},
		},
	], [customers, navigate])
	return (
		<Table
			className={'customers-table'}
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

export default CustomersTable

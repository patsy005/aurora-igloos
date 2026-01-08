import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import CustomersForm from './CustomersForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import Table from '../../components/Table/Table'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import SearchInput from '../../components/SearchInput'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function CustomersTable() {
	const customers = useSelector(state => state.customers.customers)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const [data, setData] = useState(customers)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

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

	const columns = useMemo(
		() => [
			{
				header: getContentFromMap(contentMap, 'common.name', 'Name'),
				id: 'customers_name',
				accessorFn: row => `${row.name} ${row.surname} ${row.email}`.trim(),
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
				header: getContentFromMap(contentMap, 'common.phone', 'Phone'),
				id: 'customers_phone',
				accessorKey: 'phone',
				cell: ({ row }) => {
					return <div className="customers-table__phone">{row.original.phone}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'customers.table.hasAccount', 'Has account'),
				id: 'customers_hasAccount',
				accessorKey: 'idUser',
				cell: ({ row }) => {
					return <div className="customers-table__has-account">{row.original.idUser ? 'Yes' : 'No'}</div>
				},
			},
			{
				header: '',
				accessorKey: 'actions',
				className: '',
				id: 'actions',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions">
							{canManage && (
								<span onClick={() => openEditCustomerModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							<span onClick={() => navigate(`/customers/${row.original.id}`)}>
								<ViewIcon />
							</span>
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteCustomerModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[customers, navigate]
	)
	return (
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder={getContentFromMap(contentMap, 'customers.search', 'Search customer...')} />
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

export default CustomersTable

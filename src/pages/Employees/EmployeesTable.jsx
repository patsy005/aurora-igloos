import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Table from '../../components/Table/Table'
import { useModal } from '../../contexts/modalContext'
import EmployeesForm from './EmployeesForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import SearchInput from '../../components/SearchInput'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function EmployeesTable() {
	const employees = useSelector(state => state.employees.employees)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const [data, setData] = useState(employees)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const setEmployeesCallback = useCallback(() => {
		setData(employees)
	}, [employees])

	useEffect(() => {
		setEmployeesCallback()
	}, [employees, setEmployeesCallback])

	const openEditEmployeeModal = employeeId => {
		openModal(EmployeesForm, { id: employeeId })
	}

	const openDeleteEmployeeModal = employeeId => {
		const itemToDelete = employees.find(e => e.id === +employeeId)
		openModal(DeleteConfirmation, { id: employeeId, category: 'employee', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: '',
				id: 'employeeImg',
				accessorKey: 'img',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					const src = row.original.photoUrl
						? `http://localhost:5212/${row.original.photoUrl}`
						: '/employees/employee-placeholder.png'
					return <img className="users-table__img" src={src} alt={row.original.name} />
				},
			},
			{
				header: getContentFromMap(contentMap, 'common.name', 'Name'),
				id: 'employeeName',
				accessorFn: row => `${row.name} ${row.surname} (${row.email})`,
				cell: ({ row }) => {
					return (
						<div className="users-table__name">
							<span className="name">
								{row.original.name} {row.original.surname}
							</span>
							<span className="email">{row.original.email}</span>
						</div>
					)
				},
			},
			{
				header: getContentFromMap(contentMap, 'common.address', 'Address'),
				id: 'employeeAddress',
				accessorFn: row => `${row.street}, ${row.city}, ${row.postalCode}, ${row.country}`,
				cell: ({ row }) => {
					return (
						<div className="users-table__address">
							<span className="street">{row.original.street}</span>
							<span className="city">
								{row.original.city}, {row.original.postalCode}
							</span>
							<span className="country">{row.original.country}</span>
						</div>
					)
				},
			},
			{
				header: getContentFromMap(contentMap, 'common.role', 'Role'),
				id: 'employeeRole',
				accessorKey: 'role',
				cell: ({ row }) => {
					return <div className="users-table__role">{row.original.role}</div>
				},
			},
			{
				header: '',
				id: 'employeeActions',
				accessorKey: 'actions',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					return (
						<div className="users-table__actions">
							{canManage && (
								<span className="edit-icon" onClick={() => openEditEmployeeModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							<span className="view-icon" onClick={() => navigate(`/employees/${row.original.id}`)}>
								<ViewIcon />
							</span>
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteEmployeeModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[navigate, employees, contentMap]
	)
	return (
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder={getContentFromMap(contentMap, 'employees.search', 'Search employee...')} />
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

export default EmployeesTable

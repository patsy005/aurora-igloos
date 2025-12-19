import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import Table from '../../ui/Table/Table'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '../../slices/modalSlice'
import { useModal } from '../../contexts/modalContext'
import EmployeesForm from './EmployeesForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'

function EmployeesTable() {
	const employees = useSelector(state => state.employees.employees)
	const [data, setData] = useState(employees)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { openModal } = useModal()

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

	const columns = useMemo(() => [
		{
			header: '',
			id: 'employeeImg',
			accessorKey: 'img',
			cell: ({ row }) => {
				const src = row.original.photoUrl
					? `http://localhost:5212/${row.original.photoUrl}`
					: '/employees/employee-placeholder.png'
				return <img className="users-table__img" src={src} alt={row.original.name} />
			},
		},
		{
			header: 'Name',
			id: 'employeeName',
			accessorKey: 'name',
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
			header: 'Address',
			id: 'employeeAddress',
			accessorKey: 'address',
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
			header: 'Role',
			id: 'employeeRole',
			accessorKey: 'role',
			cell: ({ row }) => {
				return <div className="users-table__role">{row.original.role}</div>
			},
		},
		// {
		// 	header: 'Status',
		// 	id: users.id,
		// 	accessorKey: 'status',
		// 	cell: ({ row }) => {
		// 		return <div className={`users-table__status status status__${row.original.status}`}>{row.original.status}</div>
		// 	},
		// },
		{
			header: 'Actions',
			id: 'employeeActions',
			accessorKey: 'actions',
			cell: ({ row }) => {
				return (
					<div className="users-table__actions">
						<span
							className="edit-icon"
							onClick={() => openEditEmployeeModal(row.original.id)}>
							<EditIcon />
						</span>
						<span className="view-icon" onClick={() => navigate(`/employees/${row.original.id}`)}>
							<ViewIcon />
						</span>
						<span
							className="delete-icon"
							onClick={() =>
								openDeleteEmployeeModal(row.original.id)
							}>
							<DeleteIcon />
						</span>
					</div>
				)
			},
		},
	], [navigate, employees])
	return (
		<Table
			className={'users-table'}
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

export default EmployeesTable

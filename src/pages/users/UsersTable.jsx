import {  useSelector } from 'react-redux'
import { selectIsAdmin } from '../../slices/authSlice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import UsersForm from './UsersForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon } from '../../ui/Icons'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table/Table'

function UsersTable() {
	const users = useSelector(state => state.users.users)
	const isAdmin = useSelector(selectIsAdmin)

	const [data, setData] = useState(users)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const setUsersCallback = useCallback(() => {
		setData(users)
	}, [users])

	useEffect(() => {
		setUsersCallback()
	}, [users, setUsersCallback])

	const openEditUserModal = userId => {
		const user = users.find(u => u.id === +userId)
		openModal(UsersForm, { id: userId, user })
	}

	const openDeleteUserModal = userId => {
		const itemToDelete = users.find(u => u.id === +userId)
		openModal(DeleteConfirmation, { id: userId, category: 'user', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: 'Name',
				id: 'userName',
				accessorFn: row => `${row.name} ${row.surname}`,
				cell: ({ row }) => {
					return (
						<div className="users-table__name">
							<span className="name">
								{row.original.name} {row.original.surname}
							</span>
						</div>
					)
				},
			},
			{
				header: 'Email',
				id: 'userEmail',
				accessorFn: row => `$(${row.email})`,
				cell: ({ row }) => {
					return (
						<div className="users-table__name">
							<span className="email">{row.original.email}</span>
						</div>
					)
				},
			},
			{
				header: 'Login',
				id: 'userLogin',
				accessorKey: 'login',
				cell: ({ row }) => {
					return (
						<div className="users-table__login">
							<span className="login">{row.original.login}</span>
						</div>
					)
				},
			},
			{
				header: 'Role',
				id: 'userRole',
				accessorKey: 'roleName',
				cell: ({ row }) => {
					return (
						<div className="users-table__role">
							<span className="role">{row.original.roleName}</span>
						</div>
					)
				},
			},
			{
				header: 'User Type',
				id: 'userType',
				accessorKey: 'userTypeName',
				cell: ({ row }) => {
					return (
						<div className="users-table__type">
							<span className="type">{row.original.userTypeName}</span>
						</div>
					)
				},
			},
			{
				header: 'Actions',
				id: 'employeeActions',
				accessorKey: 'actions',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					return (
						<div className="users-table__actions">
							{isAdmin && (
								<span className="edit-icon" onClick={() => openEditUserModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							{isAdmin && (
								<span className="delete-icon" onClick={() => openDeleteUserModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[users, isAdmin, navigate]
	)

	return (
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder="Search users..." />
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

export default UsersTable

import { useMemo, useState } from 'react'
import Table from '../Table/Table'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons'

const users = data.users
function UsersTable() {
	const [data, setData] = useState(users)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()

	const columns = useMemo(() => [
		{
			header: '',
			id: users.id,
			accessorKey: 'img',
			cell: ({ row }) => {
				return <img className="users-table__img" src={row.original.img} alt={row.original.name} />
			},
		},
		{
			header: 'Name',
			id: users.id,
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
			id: users.id,
			accessorKey: 'address',
			cell: ({ row }) => {
				return (
					<div className="users-table__address">
						<span className='street'>{row.original.address.street}</span>
						<span className='city'>
							{row.original.address.city}, {row.original.address.postalCode}
						</span>
						<span className='country'>{row.original.address.country}</span>
					</div>
				)
			},
		},
		{
			header: 'Role',
			id: users.id,
			accessorKey: 'role',
			cell: ({ row }) => {
				return <div className="users-table__role">{row.original.role}</div>
			},
		},
		{
			header: 'Status',
			id: users.id,
			accessorKey: 'status',
			cell: ({ row }) => {
				return <div className={`users-table__status status status__${row.original.status}`}>{row.original.status}</div>
			},
		},
		{
			header: 'Actions',
			id: users.id,
			accessorKey: 'actions',
			cell: ({ row }) => {
				return (
					<div className="users-table__actions">
						<span onClick={() => navigate(`/users/${row.original.id}/edit`)}>
							<EditIcon />
						</span>
						<span onClick={() => navigate(`/user/${row.original.id}`)}>
							<ViewIcon />
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

export default UsersTable

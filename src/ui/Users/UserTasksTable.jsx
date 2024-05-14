import { useMemo, useState } from 'react'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon } from '../Icons'
import Table from '../Table/Table'

const users = data.users

function UserTasksTable({userId}) {
    const user = users.find(user => user.id === +userId)
    const [data, setData] = useState(user.tasks)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

    const columns = useMemo(() => [
        {
            header: 'Task',
            id: users.id,
            accessorKey: 'task',
            cell: ({row}) => {
                return <div className="users-table__task">{row.original.title}</div>
            
            }
        },
        {
            header: 'Date',
            id: users.id,
            accessorKey: 'date',
            cell: ({row}) => {
                return <div className="users-table__date">{row.original.date}</div>
            }
        },
        {
            header: 'Time',
            id: users.id,
            accessorKey: 'time',
            cell: ({row}) => {
                return <div className="users-table__time">{row.original.time}</div>
            }
        },
        {
            header: 'Location',
            id: users.id,
            accessorKey: 'location',
            cell: ({row}) => {
                return <div className="users-table__location">{row.original.location}</div>
            }
        },
        {
            header: 'Status',
            id: users.id,
            accessorKey: 'status',
            cell: ({row}) => {
                return <div className={`users-table__status status status__${row.original.status}`}>{row.original.status}</div>
            }
        },
        {
            header: '',
            id: users.id,
            accessorKey: 'actions',
            cell: ({ row }) => {
				return (
					<div className="users-table__actions">
						<span>
							<EditIcon />
						</span>
						<span>
							<DeleteIcon />
						</span>
					</div>
				)
			},
        }
    ])
    return (
        <Table
        // className={'users-table'}
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

export default UserTasksTable

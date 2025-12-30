import { useSelector } from 'react-redux'
import { selectCanDelete, selectCanManage } from '../../../slices/authSlice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../../contexts/modalContext'
import SearchInput from '../../../components/SearchInput'
import Table from '../../../ui/Table/Table'
import { DeleteIcon, EditIcon } from '../../../ui/Icons'
import ForumCategoriesForm from './ForumCategoriesForm'
import DeleteConfirmation from '../../../components/deleteConfirmation/DeleteConfirmation'

function ForumCategoriesTable() {
	const forumCategories = useSelector(state => state.forumCategories.forumCategories)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)

	const [data, setData] = useState(forumCategories)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')

	const navigate = useNavigate()
	const { openModal } = useModal()

	const setCategoriesCallback = useCallback(() => {
		setData(forumCategories)
	}, [forumCategories])

	useEffect(() => {
		setCategoriesCallback()
	}, [forumCategories, setCategoriesCallback])

	const openEditForumCategoryModal = categoryId => {
		openModal(ForumCategoriesForm, { id: categoryId })
	}

	const openDeleteForumCategoryModal = categoryId => {
		const itemToDelete = forumCategories.find(i => i.id === +categoryId)
		openModal(DeleteConfirmation, { id: categoryId, category: 'forum-category', itemToDelete: itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: 'Foruum Category',
				id: 'forum_category',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="bookings-table__igloo">{row.original.name}</div>
				},
			},
			{
				header: '',
				accessorKey: 'bookings.actions',
				className: '',
				id: 'actions',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions justify-content-end">
							{canManage && (
								<span onClick={() => openEditForumCategoryModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteForumCategoryModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[forumCategories]
	)

	return (
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder="Search categories..." />
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

export default ForumCategoriesTable

import { useSelector } from 'react-redux'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import ContentsForm from './ContentsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table/Table'

function ContentsTable() {
	const contents = useSelector(state => state.contentBlocks.items)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])
	const [data, setData] = useState(contents)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const setContentsCallback = useCallback(() => {
		setData(contents)
	}, [contents])

	useEffect(() => {
		setContentsCallback()
	}, [contents, setContentsCallback])

	const openEditContentModal = contentId => {
		openModal(ContentsForm, { id: contentId })
	}

	const openDeleteContentModal = contentId => {
		const itemToDelete = contents.find(i => i.id === +contentId)
		openModal(DeleteConfirmation, { id: contentId, category: 'content', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: getContentFromMap(contentMap, 'content.key', 'Key'),
				id: 'contents_name',
				accessorKey: 'key',
				cell: ({ row }) => {
					return (
						<div className="bookings-table__guest">
							<span className="name">{row.original.key}</span>
						</div>
					)
				},
			},
			{
				header: getContentFromMap(contentMap, 'content.table.value', 'Value'),
				id: 'contents_value',
				accessorKey: 'value',
				cell: ({ row }) => {
					return (
						<div className="bookings-table__guest">
							<span className="name">{row.original.value}</span>
						</div>
					)
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
								<span onClick={() => openEditContentModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							<span onClick={() => navigate(`/contents/${row.original.id}`)}>
								<ViewIcon />
							</span>
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteContentModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[contents, navigate]
	)
	return (
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder={getContentFromMap(contentMap, 'content.search', 'Search content...')} />
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

export default ContentsTable

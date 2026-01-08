import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import TripSeasonsForm from './TripSeasonsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon } from '../../ui/Icons'
import Table from '../../components/Table/Table'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import SearchInput from '../../components/SearchInput'

function TripSeasonsTable() {
	const tripSeasons = useSelector(state => state.tripSeasons.tripSeasons)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const [data, setData] = useState(tripSeasons)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const setTripSeasonsCallback = useCallback(() => {
		setData(tripSeasons)
	}, [tripSeasons])

	useEffect(() => {
		setTripSeasonsCallback()
	}, [tripSeasons, setTripSeasonsCallback])

	const openEditTripSeasonModal = tripSeasonId => {
		openModal(TripSeasonsForm, { id: tripSeasonId })
	}

	const openDeleteTripSeasonModal = tripSeasonId => {
		const itemToDelete = tripSeasons.find(i => i.id === +tripSeasonId)
		openModal(DeleteConfirmation, { id: tripSeasonId, category: 'tripSeason', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: getContentFromMap(contentMap, 'common.name', 'Name'),
				id: 'tripSeasons_name',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="igloos-table__name">{row.original.name}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'form.common.label', 'Description'),
				id: 'tripSeasons_description',
				accessorKey: 'description',
				cell: ({ row }) => {
					return <div className="trip-seasons-table__description">{row.original.description}</div>
				},
			},
			{
				header: '',
				accessorKey: 'tripSeasons.actions',
				className: '',
				enableGlobalFilter: false,
				id: 'actions',
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions justify-content-end">
							{canManage && (
								<span onClick={() => openEditTripSeasonModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteTripSeasonModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[tripSeasons, navigate]
	)

	return (
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder={getContentFromMap(contentMap, 'tripSeasons.search', 'Search trip seasons...')} />
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

export default TripSeasonsTable

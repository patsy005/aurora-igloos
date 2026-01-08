import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import TripsForm from './TripsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import Table from '../../components/Table/Table'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import SearchInput from '../../components/SearchInput'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function TripsTable() {
	const trips = useSelector(state => state.trips.trips)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const [data, setData] = useState(trips)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const setTripsCallback = useCallback(() => {
		setData(trips)
	}, [trips])

	useEffect(() => {
		setTripsCallback()
	}, [trips, setTripsCallback])

	const openEditTripModal = tripId => {
		openModal(TripsForm, { id: tripId })
	}

	const openDeleteTripModal = tripId => {
		const itemToDelete = trips.find(i => i.id === +tripId)
		openModal(DeleteConfirmation, { id: tripId, category: 'trip', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: '',
				id: 'iglooImg',
				accessorKey: 'img',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					const src = row.original.photoUrl
						? `http://localhost:5212/${row.original.photoUrl}`
						: '/trips/trip-placeholder.png'
					return <img className="igloos-table__img" src={src} alt={row.original.name} />
				},
			},
			{
				header: getContentFromMap(contentMap, 'common.name', 'Name'),
				id: 'trips_name',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="igloos-table__name">{row.original.name}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'form.common.label', 'Description'),
				id: 'trips_description',
				accessorKey: 'shortDescription',
				cell: ({ row }) => {
					return <div className="users-table__address">{row.original.shortDescription}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'trips.table.lvl', 'Lvl of difficulty'),
				id: 'trips_difficulty',
				accessorKey: 'levelOfDifficultyName',
				cell: ({ row }) => {

					return <div className="">{row.original.levelOfDifficultyName}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'common.season', 'Season'),
				id: 'trips_season',
				accessorKey: 'seasonName',
				cell: ({ row }) => {
					return <div className="">{row.original.seasonName}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'trips.table.price', 'Price/person'),
				id: 'trips_price',
				accessorKey: 'pricePerPerson',
				cell: ({ row }) => {
					return <div className="">{row.original.pricePerPerson} $</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'trips.duration', 'Durarion (days)'),
				id: 'trips_duration',
				accessorKey: 'duration',
				cell: ({ row }) => {
					return <div className="">{row.original.duration}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'common.guide', 'Guide'),
				id: 'trips_guide',
				accessorKey: 'guideName',
				cell: ({ row }) => {
					return <div className="">{row.original.guideName}</div>
				},
			},
			{
				header: '',
				accessorKey: 'trips.actions',
				className: '',
				id: 'actions',
				enableGlobalFilter: false,
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions">
							{canManage && (
								<span onClick={() => openEditTripModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							<span onClick={() => navigate(`/trips/${row.original.id}`)}>
								<ViewIcon />
							</span>
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteTripModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[trips]
	)

	return (
		<div>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder={getContentFromMap(contentMap, 'trips.search', 'Search trips...')} />
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
		</div>
	)
}

export default TripsTable

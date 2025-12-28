import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import TripsForm from './TripsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import Table from '../../ui/Table/Table'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'

function TripsTable() {
	const trips = useSelector(state => state.trips.trips)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const [data, setData] = useState(trips)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const { openModal } = useModal()

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
				cell: ({ row }) => {
					console.log(row.original.id)
					const src = row.original.photoUrl
						? `http://localhost:5212/${row.original.photoUrl}`
						: '/trips/trip-placeholder.png'
					return <img className="igloos-table__img" src={src} alt={row.original.name} />
				},
			},
			{
				header: 'Name',
				id: 'trips_name',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="igloos-table__name">{row.original.name}</div>
				},
			},
			{
				header: 'Description',
				id: 'trips_description',
				accessorKey: 'description',
				cell: ({ row }) => {
					return <div className="users-table__address">{row.original.shortDescription}</div>
				},
			},
			{
				header: 'Lvl of difficulty',
				id: 'trips_difficulty',
				accessorKey: 'difficultyLevel',
				cell: ({ row }) => {
					return <div className="">{row.original.levelOfDifficultyName}</div>
				},
			},
			{
				header: 'Season',
				id: 'trips_season',
				accessorKey: 'season',
				cell: ({ row }) => {
					return <div className="">{row.original.seasonName}</div>
				},
			},
			{
				header: 'Price/person',
				id: 'trips_price',
				accessorKey: 'pricePerPerson',
				cell: ({ row }) => {
					return <div className="">{row.original.pricePerPerson} $</div>
				},
			},
			{
				header: 'Durarion (days)',
				id: 'trips_duration',
				accessorKey: 'durationDays',
				cell: ({ row }) => {
					return <div className="">{row.original.duration}</div>
				},
			},
			{
				header: 'Guide',
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
		<Table
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

export default TripsTable

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import TripLevelsForm from './TripLevelsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon } from '../../ui/Icons'
import Table from '../../ui/Table/Table'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'

function TripLevelsTable() {
	const tripLevels = useSelector(state => state.tripLevels.tripLevels)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const [data, setData] = useState(tripLevels)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const { openModal } = useModal()

	const setTripLevelsCallback = useCallback(() => {
		setData(tripLevels)
	}, [tripLevels])

	useEffect(() => {
		setTripLevelsCallback()
	}, [tripLevels, setTripLevelsCallback])

	const openEditTripLevelModal = tripLevelId => {
		openModal(TripLevelsForm, { id: tripLevelId })
	}

	const openDeleteTripLevelModal = tripLevelId => {
		const itemToDelete = tripLevels.find(i => i.id === +tripLevelId)
		openModal(DeleteConfirmation, { id: tripLevelId, category: 'tripLevel', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: 'Name',
				id: 'tripLevels_name',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="igloos-table__name">{row.original.name}</div>
				},
			},
			{
				header: 'Description',
				id: 'tripLevels_description',
				accessorKey: 'description',
				cell: ({ row }) => {
					return <div className="trip-levels-table__description">{row.original.description}</div>
				},
			},
			{
				header: 'Level Code',
				id: 'tripLevels_levelCode',
				accessorKey: 'levelCode',
				cell: ({ row }) => {
					return <div className="trip-levels-table__level-code">{row.original.level}</div>
				},
			},
			{
				header: '',
				accessorKey: 'tripSeasons.actions',
				className: '',
				id: 'actions',
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions justify-content-end">
							{canManage && (
								<span onClick={() => openEditTripLevelModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteTripLevelModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[tripLevels, navigate]
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

export default TripLevelsTable

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import TripSeasonsForm from './TripSeasonsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import Table from '../../ui/Table/Table'

function TripSeasonsTable() {
	const tripSeasons = useSelector(state => state.tripSeasons.tripSeasons)
	const [data, setData] = useState(tripSeasons)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const { openModal } = useModal()

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
				header: 'Name',
				id: 'tripSeasons_name',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="igloos-table__name">{row.original.name}</div>
				},
			},
			{
				header: 'Description',
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
				id: 'actions',
				cell: ({ row }) => {
					return (
						<div className="bookings-table__actions justify-content-end">
							<span onClick={() => openEditTripSeasonModal(row.original.id)}>
								<EditIcon />
							</span>
							<span className="delete-icon" onClick={() => openDeleteTripSeasonModal(row.original.id)}>
								<DeleteIcon />
							</span>
						</div>
					)
				},
			},
		],
		[tripSeasons, navigate]
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

export default TripSeasonsTable

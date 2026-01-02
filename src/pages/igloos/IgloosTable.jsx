import { useSelector } from 'react-redux'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import IgloosForm from './IgloosForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table/Table'

function IgloosTable() {
	const igloos = useSelector(state => state.igloos.igloos)
	const discounts = useSelector(state => state.discounts.discounts)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const [data, setData] = useState(igloos)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const setIgloosCallback = useCallback(() => {
		setData(igloos)
	}, [igloos])

	useEffect(() => {
		setIgloosCallback()
	}, [igloos, setIgloosCallback])

	const openEditIglooModal = iglooId => {
		openModal(IgloosForm, { id: iglooId })
	}

	const openDeleteIglooModal = iglooId => {
		const itemToDelete = igloos.find(i => i.id === +iglooId)
		openModal(DeleteConfirmation, { id: iglooId, category: 'igloo', itemToDelete })
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
						: '/images/igloo-placeholder.png'
					return <img className="igloos-table__img" src={src} alt={row.original.name} />
				},
			},
			{
				header: 'Name',
				id: 'iglooName',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="igloos-table__name">{row.original.name}</div>
				},
			},
			{
				header: 'Capacity',
				id: 'iglooCapacity',
				accessorKey: 'capacity',
				cell: ({ row }) => {
					return <div className="igloos-table__capacity">00{row.original.capacity}</div>
				},
			},
			{
				header: '$ per night',
				id: 'iglooPrice',
				accessorKey: 'pricePerNight',
				cell: ({ row }) => {
					return <div className="igloos-table__price">$ {row.original.pricePerNight}</div>
				},
			},
			{
				header: 'Promotion',
				id: 'iglooPromotion',
				accessorKey: 'promotion',
				cell: ({ row }) => {
					const id = row.original.id
					const promotion = discounts.find(d => d.id === row.original.idDiscount)
					const promoNameClass = promotion?.name.toLowerCase().replace(' ', '-')
					if (promotion) {
						return (
							<div
								className={`igloos-table__promotion ${promoNameClass}`}
								onClick={() => navigate(`/promotions/${promotion.id}`)}>
								{promotion.name}
							</div>
						)
					} else {
						return <div className="igloos-table__promotion">--</div>
					}
				},
			},
			{
				header: '',
				id: 'iglooActions',
				accessorKey: 'actions',
				cell: ({ row }) => {
					return (
						<div className="igloos-table__actions">
							{canManage && (
								<span className="edit-icon" onClick={() => openEditIglooModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							<span
								className="view-icon"
								onClick={() => {
									console.log('view click')
									navigate(`/igloos/${row.original.id}`)
								}}>
								<ViewIcon />
							</span>
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteIglooModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[igloos, navigate, discounts]
	) // eslint-disable-line
	return (
		<div>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder="Search igloos..." />
			</div>
			<Table
				className={'igloos-table'}
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

export default IgloosTable

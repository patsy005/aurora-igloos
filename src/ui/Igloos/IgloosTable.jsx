/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react'
import Table from '../Table/Table'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons'
import { openModal } from '../../slices/modalSlice'

// const igloos = data.igloos
// const promotions = data.promotions

function IgloosTable() {
	const igloos = useSelector(state => state.igloos.igloos)
	const discounts = useSelector(state => state.discounts.discounts)
	const [data, setData] = useState(igloos)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const setIgloosCallback = useCallback(() => {
		setData(igloos)
	}, [igloos])

	useEffect(() => {
		setIgloosCallback()
	}, [igloos, setIgloosCallback])

	const columns = useMemo(
		() => [
			{
				header: '',
				id: 'iglooImg',
				accessorKey: 'img',
				cell: ({ row }) => {
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
				accessorKey: 'price',
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
							<span
								className="edit-icon"
								onClick={() => dispatch(openModal({ id: row.original.id, type: 'editIgloo', category: 'igloo' }))}>
								<EditIcon />
							</span>
							<span
								className="view-icon"
								onClick={() => {
									console.log('view click')
									navigate(`/igloos/${row.original.id}`)
								}}>
								<ViewIcon />
							</span>
							<span
								className="delete-icon"
								onClick={() => dispatch(openModal({ id: row.original.id, type: 'deleteIgloo', category: 'igloo' }))}>
								<DeleteIcon />
							</span>
						</div>
					)
				},
			},
		],
		[igloos, navigate, discounts]
	) // eslint-disable-line
	return (
		<Table
			className={'igloos-table'}
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

export default IgloosTable

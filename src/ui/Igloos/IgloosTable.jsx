/* eslint-disable no-unused-vars */
import { useMemo, useState } from 'react'
import Table from '../Table/Table'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons'

const igloos = data.igloos
const promotions = data.promotions

function IgloosTable() {
	const [data, setData] = useState(igloos)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()

	const columns = useMemo(() => [
		{
			header: '',
			id: igloos.id,
			accessorKey: 'img',
			cell: ({ row }) => {
				return <img className="igloos-table__img" src={row.original.imagePath} alt={row.original.name} />
			},
		},
		{
			header: 'Name',
			id: igloos.id,
			accessorKey: 'name',
			cell: ({ row }) => {
				return <div className="igloos-table__name">{row.original.name}</div>
			},
		},
		{
			header: 'Capacity',
			id: igloos.id,
			accessorKey: 'capacity',
			cell: ({ row }) => {
				return <div className="igloos-table__capacity">00{row.original.capacity}</div>
			},
		},
		{
			header: '$ per night',
			id: igloos.id,
			accessorKey: 'price',
			cell: ({ row }) => {
				return <div className="igloos-table__price">$ {row.original.pricePerNight}</div>
			},
		},
		{
			header: 'Promotion',
			id: igloos.id,
			accessorKey: 'promotion',
			cell: ({ row }) => {
				const id = row.original.id
				const promotion = promotions.find(promo => promo.iglooId.includes(id))
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
			id: igloos.id,
			accessorKey: 'actions',
			cell: ({ row }) => {
				return (
					<div className="igloos-table__actions">
						<span className="edit-icon" onClick={() => navigate(`/igloos/${row.original.id}/edit`)}>
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
						<span className="delete-icon">
							<DeleteIcon />
						</span>
					</div>
				)
			},
		},
	])
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

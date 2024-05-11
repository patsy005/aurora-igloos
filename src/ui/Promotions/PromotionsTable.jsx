import { useMemo, useState } from 'react'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons'

import { useNavigate } from 'react-router-dom'
import Table from '../Table/Table'

const promotions = data.promotions
const igloos = data.igloos

function PromotionsTable() {
	const [data, setData] = useState(promotions)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()

	const columns = useMemo(() => [
		{
			header: 'Name',
			id: promotions.id,
			accessorKey: 'name',
			cell: ({ row }) => {
				return <div className="promo-table__name">{row.original.name}</div>
			},
		},
		{
			header: 'Valid period',
			id: promotions.id,
			accessorKey: 'validPeriod',
			cell: ({ row }) => {
				return (
					<div className="promo-table__valid-period">
						{row.original.validFrom}-{row.original.validTo}
					</div>
				)
			},
		},
		{
			header: 'Description',
			id: promotions.id,
			accessorKey: 'description',
			cell: ({ row }) => {
				return <div className="promo-table__description">{row.original.description}</div>
			},
		},
		{
			header: 'Discount',
			id: promotions.id,
			accessorKey: 'discount',
			cell: ({ row }) => {
				return <div className="promo-table__discount">{row.original.discount}</div>
			},
		},
		{
			header: 'Igloos',
			id: promotions.id,
			accessorKey: 'igloos',
			cell: ({ row }) => {
				const promoIgloos = row.original.iglooId
				return (
					<div className="promo-table__igloos">
						{promoIgloos.map(iglooId => {
							const igloo = igloos.find(igloo => igloo.id === iglooId)
							return (
								<div className="promo-table__igloo" key={igloo.id}>
									{igloo.name}
								</div>
							)
						})}
					</div>
				)
			},
		},
		{
			header: '',
			id: promotions.id,
			accessorKey: 'actions',
			cell: ({ row }) => {
				return (
					<div className="igloos-table__actions">
					<span className="edit-icon" onClick={() => navigate(`/promotions/${row.original.id}/edit`)}>
						<EditIcon />
					</span>
					<span
						className="view-icon"
						onClick={() => {
							console.log('view click')
							navigate(`/promotions/${row.original.id}`)
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
			className={'promo-table'}
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

export default PromotionsTable

import { useCallback, useEffect, useMemo, useState } from 'react'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons'

import { useNavigate } from 'react-router-dom'
import Table from '../Table/Table'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import PromoForm from './PromoForm'
import { useModal } from '../../contexts/modalContext'
import { useDispatch, useSelector } from 'react-redux'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'

function PromotionsTable() {
	const discounts = useSelector(state => state.discounts.discounts)
	const igloos = useSelector(state => state.igloos.igloos)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const [data, setData] = useState(discounts)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { openModal } = useModal()

	const setDiscountsCallback = useCallback(() => {
		setData(discounts)
	}, [discounts])

	useEffect(() => {
		setDiscountsCallback()
	}, [discounts, setDiscountsCallback])

	const openEditDiscountModal = discountId => {
		openModal(PromoForm, { id: discountId })
	}

	const openDeleteDiscountModal = discountId => {
		const itemToDelete = discounts.find(i => i.id === +discountId)
		openModal(DeleteConfirmation, { id: discountId, category: 'discount', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: 'Name',
				id: 'discontName',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="promo-table__name">{row.original.name}</div>
				},
			},
			{
				header: 'Valid period',
				id: 'discountValidPeriod',
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
				id: 'discountDescription',
				accessorKey: 'description',
				cell: ({ row }) => {
					return <div className="promo-table__description">{row.original.description}</div>
				},
			},
			{
				header: 'Discount',
				id: 'discountPercentage',
				accessorKey: 'discount',
				cell: ({ row }) => {
					return <div className="promo-table__discount">{row.original.discount}%</div>
				},
			},
			{
				header: 'Igloos',
				id: 'discountIgloos',
				accessorKey: 'igloos',
				cell: ({ row }) => {
					const relatedIgloos = igloos.filter(igloo => igloo.idDiscount === row.original.id)
					console.log('igloos', igloos)
					console.log('discountIgloos', relatedIgloos)

					if (!relatedIgloos.length) return <div className="promo-table__igloos">--</div>
					return (
						<div className="promo-table__igloos">
							{relatedIgloos.map(igloo => {
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
				id: 'discountActions',
				accessorKey: 'actions',
				cell: ({ row }) => {
					return (
						<div className="igloos-table__actions">
							{canManage && (
								<span className="edit-icon" onClick={() => openEditDiscountModal(row.original.id)}>
									<EditIcon />
								</span>
							)}
							<span
								className="view-icon"
								onClick={() => {
									navigate(`/promotions/${row.original.id}`)
								}}>
								<ViewIcon />
							</span>
							{canDelete && (
								<span className="delete-icon" onClick={() => openDeleteDiscountModal(row.original.id)}>
									<DeleteIcon />
								</span>
							)}
						</div>
					)
				},
			},
		],
		[igloos, navigate, discounts]
	)
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

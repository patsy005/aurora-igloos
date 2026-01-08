import {  useSelector } from 'react-redux'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import DiscountsForm from './DiscountsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon, ViewIcon } from '../../ui/Icons'
import SearchInput from '../../components/SearchInput'
import Table from '../../components/Table/Table'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function DiscountsTable() {
	const discounts = useSelector(state => state.discounts.discounts)
	const igloos = useSelector(state => state.igloos.igloos)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const [data, setData] = useState(discounts)
	const [columnFilters, setColumnFilters] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
	const [globalFilter, setGlobalFilter] = useState('')
	const navigate = useNavigate()
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const setDiscountsCallback = useCallback(() => {
		setData(discounts)
	}, [discounts])

	useEffect(() => {
		setDiscountsCallback()
	}, [discounts, setDiscountsCallback])

	const openEditDiscountModal = discountId => {
		openModal(DiscountsForm, { id: discountId })
	}

	const openDeleteDiscountModal = discountId => {
		const itemToDelete = discounts.find(i => i.id === +discountId)
		openModal(DeleteConfirmation, { id: discountId, category: 'discount', itemToDelete })
	}

	const columns = useMemo(
		() => [
			{
				header: getContentFromMap(contentMap, 'common.name', 'Name'),
				id: 'discontName',
				accessorKey: 'name',
				cell: ({ row }) => {
					return <div className="promo-table__name">{row.original.name}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'discounts.table.valiidPeriod', 'Valid period'),
				id: 'discountValidPeriod',
				accessorFn: row => `${row.validFrom} ${row.validTo}`.trim(),
				cell: ({ row }) => {
					return (
						<div className="promo-table__valid-period">
							{row.original.validFrom}-{row.original.validTo}
						</div>
					)
				},
			},
			{
				header: getContentFromMap(contentMap, 'form.common.label', 'Description'),
				id: 'discountDescription',
				accessorKey: 'description',
				cell: ({ row }) => {
					return <div className="promo-table__description">{row.original.description}</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'form.common.label.discount', 'Discount'),
				id: 'discountPercentage',
				accessorKey: 'discount',
				cell: ({ row }) => {
					return <div className="promo-table__discount">{row.original.discount}%</div>
				},
			},
			{
				header: getContentFromMap(contentMap, 'igloos.heading', 'Igloos'),
				id: 'discountIgloos',
				accessorFn: row => row.igloos,
				cell: ({ row }) => {
					const relatedIgloos = igloos.filter(igloo => igloo.idDiscount === row.original.id)

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
				enableGlobalFilter: false,
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
									navigate(`/discounts/${row.original.id}`)
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
		<>
			<div className="mt-4 d-flex justify-content-end">
				<SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder={getContentFromMap(contentMap, 'discounts.search', 'Search discounts...')} />
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

export default DiscountsTable

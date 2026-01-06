import { ArrowDownIcon, ArrowUpIcon, LineIcon, NextIcon, PrevIcon } from '../../ui/Icons'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'

const globalIncludes = (row, columnId, filterValue) => {
	const q = String(filterValue ?? '')
		.toLowerCase()
		.trim()
	if (!q) return true

	const v = row.getValue(columnId)
	if (v == null) return false

	return String(v).toLowerCase().includes(q)
}

function Table({
	data,
	columns,
	columnFilters,
	pagination,
	setData,
	setPagination,
	setColumnFilters,
	className,
	globalFilter = '',
	setGlobalFilter = () => {},
}) {
	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters,
			pagination,
			globalFilter,
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: 'onChange',
		onPaginationChange: setPagination,
		onGlobalFilterChange: setGlobalFilter,

		globalFilterFn: globalIncludes,

		meta: {
			updateData: (rowIndex, columnId, value) => {
				setData(prev => {
					prev.map((row, index) => (index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row))
				})
			},
		},
	})

	return (
		<>
			<div className="col-12 overflow-x-scroll mt-5 table-container">
				<table className={`table table-hover ${className}`}>
					{table.getHeaderGroups().map(headerGroup => (
						<thead key={headerGroup.id}>
							<tr>
								{headerGroup.headers.map(header => (
									<th
										className={`sorting-header ${header.id === 'img' ? 'igloos-table__td-img' : ''}`}
										onClick={header.column.getToggleSortingHandler()}
										key={header.id}>
										{header.column.columnDef.header}

										{header.column.getCanSort()}
										{
											{
												asc: <ArrowUpIcon />,
												desc: <ArrowDownIcon />,
											}[header.column.getIsSorted()]
										}
									</th>
								))}
							</tr>
						</thead>
					))}
					<tbody>
						{table.getRowModel().rows.length === 0 ? (
							<tr>
								<td colSpan={columns.length} className="no-results">
									<div className="no-results-content">
										<span className="no-results-icon">🔍</span>
										<p className="no-results-text">No results found</p>
										<p className="no-results-subtext">Try adjusting your search or filters</p>
									</div>
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map(row => (
								<tr key={row.id}>
									{row.getVisibleCells().map(cell => (
										<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
				{Object.keys(table.getRowModel().rowsById).length > 5 && (
					<div className="pagination-row">
						<p className="pagination-info">
							Page <span>{table.getState().pagination.pageIndex + 1}</span> of <span>{table.getPageCount()}</span>
						</p>
						<div className="pagination-btns">
							<div className="pagination-btns__group">
								<button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
									<PrevIcon />
									<span>Previous</span>
								</button>
							</div>
							<LineIcon />
							<div className="pagination-btns__group">
								<button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
									<span>Next</span>
									<NextIcon />
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default Table

/* eslint-disable react/jsx-key */
import { useEffect } from 'react'
import Pagination from './Pagination'
import { useTable, useSortBy } from 'react-table'

const Table = ({
	columns,
	data,
	size,
	onRowClick,
	selectedRow,
	loading,
	totalRows,
	pageChangeHandler,
	currentPage,
	setCurrentPage,
	setSortBy = () => {},
}) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state: { sortBy },
	} = useTable(
		{
			columns,
			data,
			manualPagination: true,
			manualSortBy: true,
		},
		useSortBy
	)

    console.log(totalRows)

	useEffect(() => {
		setSortBy(sortBy)
	}, [sortBy])

    useEffect(() => {
        
    }, [])

	return (
		<>
			<table className={`table table-hover table-${size}`} {...getTableProps()}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row)
						const extraClass = '' + row.original.id === selectedRow ? 'active' : ''
						return (
							<tr
								{...row.getRowProps({ className: extraClass })}
								onClick={() => (onRowClick ? onRowClick(row) : false)}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			{/* {totalRows && pageChangeHandler &&
        <>
          <Pagination
            totalRows={totalRows}
            pageChangeHandler={pageChangeHandler}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      } */}
			<Pagination totalRows={totalRows} />
		</>
	)
}

export default Table

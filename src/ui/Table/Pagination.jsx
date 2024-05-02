import PaginationBtn from './PaginationBtn'
import { LineIcon, NextIcon, PrevIcon } from '../Icons'

function Pagination({ table }) {
	return (
		<div className="pagination-row col-12">
			<div className="pages-info">
				<p>
					Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
				</p>
			</div>
			<div className="pagination-btns">
				<div className="pagination-btns__group">
					<PaginationBtn onClick={table.previousPage()} disabled={!table.getCanPreviousPage()}>
						<PrevIcon />
						<span>Previous</span>
					</PaginationBtn>
				</div>
				<LineIcon />
				<div className="pagination-btns__group">
					<PaginationBtn onClick={table.nextPage()} disabled={!table.getCanNextPage}>
						<NextIcon />
						<span>Next</span>
					</PaginationBtn>
				</div>
			</div>
		</div>
	)
}

export default Pagination

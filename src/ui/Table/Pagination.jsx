import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PAGE_SIZE } from '../../utils/consts'
import { current } from '@reduxjs/toolkit'
import PaginationBtn from './PaginationBtn'
import { LineIcon, NextIcon, PrevIcon } from '../Icons'

function Pagination({ totalRows }) {
	// const [pageRows, setPageRows] = useState(10)
	// const [isFirstPage, setIsFirstPage] = useState(true)
	// const [isLastPage, setIsLastPage] = useState(false)

	// const numberOfPages = Math.ceil(totalRows / pageRows)

	// const pagesArr = [...new AreaChart(numberOfPages)]

	// const nextPageHandler = () => { setCurrentPage(currentPage + 1) }
	// const prevPageHandler = () => { setCurrentPage(currentPage - 1) }
	// const pageSelectHandler = (pageNo) => { setCurrentPage(pageNo) }

	const [searchParams, setSearchParams] = useSearchParams()
	const currentPage = !searchParams.get('page') ? 1 : Number(searchParams.get('page'))
	const pageCount = Math.ceil(totalRows / PAGE_SIZE)

	function nextPage() {
		const next = currentPage === pageCount ? currentPage : currentPage + 1

		searchParams.set('page', next)
		setSearchParams(searchParams)
	}

	function prevPage() {
		const prev = currentPage === 1 ? currentPage : currentPage - 1

		searchParams.set('page', prev)
		setSearchParams(searchParams)
	}

	if (pageCount <= 1) return null

	return (
		<div className="pagination-row col-12">
			<div className="pages-info">
				<p>
					<span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to
					<span>{currentPage === pageCount ? totalRows : currentPage * PAGE_SIZE}</span> of <span>{totalRows}</span>
				</p>
			</div>
            <div className="pagination-btns">
                <div className="pagination-btns__group">
                    <PaginationBtn onClick={prevPage} disabled={currentPage === 1}>
                        <PrevIcon />
                        <span>Previous</span>
                    </PaginationBtn>
                </div>
                <LineIcon />
                <div className="pagination-btns__group">
                    <PaginationBtn onClick={nextPage} disabled={currentPage === pageCount}>
                        <NextIcon />
                        <span>Next</span>
                    </PaginationBtn>
                </div>
            </div>
		</div>
	)
}

export default Pagination

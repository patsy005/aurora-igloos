import ReactSelect from 'react-select'
import SearchInput from '../../components/SearchInput'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function ForumActions({ search, setSerch }) {
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const sortOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'date', label: 'Date' },
		{ value: 'numberOfComments', label: 'Number of Comments' },
	]
	return (
		<div className="forum__actions flex-column gap-3 flex-sm-row mt-5">
			<div className="forum__actions--select col-8 col-sm-4">
				<ReactSelect
					closeMenuOnSelect={true}
					defaultValue={sortOptions[0]}
					// isMulti
					options={sortOptions}
					// menuIsOpen
					classNamePrefix="react-select"
				/>
			</div>

			<SearchInput value={search} onChange={setSerch} placeholder={getContentFromMap(contentMap, 'forumPost.search', 'Search posts')} />
		</div>
	)
}

export default ForumActions

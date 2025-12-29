import ReactSelect from 'react-select'
import SearchInput from '../../components/SearchInput'

function ForumActions({ search, setSerch }) {
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

			<SearchInput value={search} onChange={setSerch} placeholder='Search posts' />
		</div>
	)
}

export default ForumActions

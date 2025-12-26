import ReactSelect from 'react-select'
import SearchInput from '../../components/SearchInput'

function ForumActions() {
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

			<SearchInput />
		</div>
	)
}

export default ForumActions

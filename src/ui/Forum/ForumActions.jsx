import ReactSelect from 'react-select'
import SearchInput from '../../components/SearchInput'

function ForumActions() {
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'recent', label: 'Recent' },
		{ value: 'read', label: 'Read' },
		{ value: 'unread', label: 'Unread' },
	]
	return (
		<div className="forum__actions flex-column gap-3 flex-sm-row mt-5">
			<div className="forum__actions--select col-8 col-sm-4">
				<ReactSelect
					closeMenuOnSelect={true}
					defaultValue={options[1]}
					// isMulti
					options={options}
					// menuIsOpen
					classNamePrefix="react-select"
				/>
			</div>

			<SearchInput />
		</div>
	)
}

export default ForumActions

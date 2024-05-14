import ReactSelect from 'react-select'
import { EditIcon, ExitIcon, ExitIconSmall, SearchIcon } from '../Icons'
import { useState } from 'react'

function ForumActions() {
	const [search, setSearch] = useState('')
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

			<div className="forum__actions--search input col-8 col-sm-4">
				{search === '' && <SearchIcon />}
				{search !== '' && <ExitIconSmall onClick={() => setSearch('')} />}
				<input type="search" value={search} placeholder="Search" onChange={e => setSearch(e.target.value)} />
			</div>
		</div>
	)
}

export default ForumActions

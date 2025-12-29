import { useState } from 'react'
import { ExitIconSmall, SearchIcon } from '../ui/Icons'

function SearchInput({ value = '', onChange = () => {}, placeholder = 'Search', className = '' }) {
	// const [search, setSearch] = useState('')

	return (
		<div className={`forum__actions--search input col-8 col-sm-4 ${className}`}>
			{value === '' && <SearchIcon />}
			{value !== '' && <ExitIconSmall onClick={() => onChange('')} />}
			<input type="search" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
		</div>
	)
}

export default SearchInput

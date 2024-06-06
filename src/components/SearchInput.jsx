import { useState } from "react"
import { ExitIconSmall, SearchIcon } from "../ui/Icons"

function SearchInput() {
    const [search, setSearch] = useState('')

    return (
			<div className="forum__actions--search input col-8 col-sm-4">
				{search === '' && <SearchIcon />}
				{search !== '' && <ExitIconSmall onClick={() => setSearch('')} />}
				<input type="search" value={search} placeholder="Search" onChange={e => setSearch(e.target.value)} />
			</div>
    )
}

export default SearchInput

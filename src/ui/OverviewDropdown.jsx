function OverviewDropdown({ options, selectedOption, setSelectedOption }) {
	const handleSelectOption = e => {
		const selectedValue = e.target.value
		const option = options.find(option => option.value === selectedValue)
		setSelectedOption(option)
	}
	return (
		<>
			<select value={selectedOption.value} onChange={handleSelectOption} className="stats-dropdown col-5 col-sm-4">
				{/* <p>Last 30 days</p> */}
				{options.map(option => {
					return (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					)
				})}
				{/* <ArrowDownIcon /> */}
			</select>
		</>
	)
}

export default OverviewDropdown

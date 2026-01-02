function Spinner({ className }) {
	return (
		<div className={`spinnerContainer spinnerContainer__${className}`}>
			<div className={`spinner spinner__${className}`}></div>
		</div>
	)
}

export default Spinner

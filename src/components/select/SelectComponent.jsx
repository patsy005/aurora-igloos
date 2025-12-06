import { useDispatch } from 'react-redux'
import Select from 'react-select'

function SelectComponent({ options, dispatchFn, onChangeFn, className, ...rest }) {
	const dispatch = useDispatch()

	const onChange = e => {
		if (dispatchFn) {
			dispatch(dispatchFn(e.value))
		} else if (onChangeFn) {
			onChangeFn(e.value)
		}
	}

	return (
		<Select
			options={options}
			className={`select ${className}`}
			classNamePrefix="select"
			onChange={e => onChange(e)}
			{...rest}
		/>
	)
}

export default SelectComponent

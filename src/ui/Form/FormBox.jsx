function FormBox({ label, error, children, labelClassName = '', className = '' }) {
	console.log('FormBox label:', label, 'children exists?', !!children, 'children:', children)

	return (
		<div className={`form__box col-12 col-sm-5 ${className}`}>
			<label htmlFor={children.props.id} className={`label ${labelClassName}`}>
				{label}
			</label>
			{children}
			{error && <p className="error-msg">{error}</p>}
		</div>
	)
}

export default FormBox

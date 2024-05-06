function InputFIle({ label, error, children }) {
	return (
		<div className="form__box col-12 col-sm-5">
			<div className="label from__box">
				{label}
				<label htmlFor={children.props.id} className="label-input-file">
					{children}
				</label>
			</div>

			{error && <p className="error-msg">{error}</p>}
		</div>
	)
}

export default InputFIle

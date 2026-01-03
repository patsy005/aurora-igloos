function CreateAccountType({ register, errors }) {
	return (
		<div className="form__box col-12 col-sm-5 mt-4">
			<p className="label">Account For</p>
			<div className="radioGroup flex-row">
				<div className="radioBtn">
					<input
						className="ratio-input"
						type="radio"
						value="employee"
						{...register('accountFor', { required: 'Choose account type' })}
					/>
					<label>Employee</label>
				</div>

				<div className="radioBtn">
					<input
						className="ratio-input"
						type="radio"
						value="customer"
						{...register('accountFor', { required: 'Choose account type' })}
					/>
					<label>Customer</label>
				</div>
			</div>
			{errors.accountFor && <p className="error-message mt-1">{errors.accountFor.message}</p>}
		</div>
	)
}

export default CreateAccountType

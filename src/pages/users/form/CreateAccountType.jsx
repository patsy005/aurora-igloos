import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { contentArrayToMap, getContentFromMap } from '../../../utils/utils'

function CreateAccountType({ register, errors }) {
	const content = useSelector(state => state.contentBlocks.items)

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	return (
		<div className="form__box col-12 col-sm-5 mt-4">
			<p className="label">{getContentFromMap(contentMap, 'users.form.acountFor', 'Account For')}</p>
			<div className="radioGroup flex-row">
				<div className="radioBtn">
					<input
						className="ratio-input"
						type="radio"
						value="employee"
						{...register('accountFor', { required: 'Choose account type' })}
					/>
					<label>{getContentFromMap(contentMap, 'common.employee', 'Employee')}</label>
				</div>

				<div className="radioBtn">
					<input
						className="ratio-input"
						type="radio"
						value="customer"
						{...register('accountFor', { required: 'Choose account type' })}
					/>
					<label>{getContentFromMap(contentMap, 'common.customer', 'Customer')}</label>
				</div>
			</div>
			{errors.accountFor && <p className="error-message mt-1">{errors.accountFor.message}</p>}
		</div>
	)
}

export default CreateAccountType

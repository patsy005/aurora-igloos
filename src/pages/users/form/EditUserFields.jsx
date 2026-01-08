import { Controller } from 'react-hook-form'
import FormBox from '../../../components/Form/FormBox'
import SelectComponent from '../../../components/select/SelectComponent'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { contentArrayToMap, getContentFromMap } from '../../../utils/utils'

function EditUserFields({ register, control, errors, userRoleOptions, userTypeOptions }) {
	const content = useSelector(state => state.contentBlocks.items)

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	return (
		<>
			<FormBox
				label={getContentFromMap(contentMap, 'common.login', 'Login')}
				error={errors?.login?.message}
				className="mt-4">
				<input
					id="login"
					className={`input ${errors.login ? 'input-error' : ''}`}
					{...register('login', {
						required: 'Login is required',
						minLength: { value: 3, message: 'Login must be at least 3 characters long' },
					})}
				/>
			</FormBox>

			<FormBox
				label={getContentFromMap(contentMap, 'users.form.edit.password.label', 'Password (optional)')}
				error={errors?.password?.message}
				className="mt-4">
				<input
					id="password"
					type="password"
					className={`input ${errors.password ? 'input-error' : ''}`}
					{...register('password', {
						minLength: { value: 6, message: 'Password must be at least 6 characters long' },
					})}
					placeholder="Leave empty to keep current password"
				/>
			</FormBox>

			<FormBox
				label={getContentFromMap(contentMap, 'form.label.userRole', 'User Role')}
				error={errors?.userRoleId?.message}
				className="mt-4">
				<Controller
					name="userRoleId"
					control={control}
					rules={{ required: 'User role is required' }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="userRoleId"
							className={`react-select ${errors.userRoleId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="userRoleId"
							options={userRoleOptions}
							value={userRoleOptions.find(o => o.value === value) ?? userRoleOptions[0]}
							placeholder="Select user role"
							onChangeFn={onChange}
						/>
					)}
				/>
			</FormBox>

			<FormBox
				label={getContentFromMap(contentMap, 'common.userType', 'User Type')}
				error={errors?.userTypeId?.message}
				className="mt-4">
				<Controller
					name="userTypeId"
					control={control}
					rules={{ required: 'User type is required' }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="userTypeId"
							className={`react-select ${errors.userTypeId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="userTypeId"
							options={userTypeOptions}
							value={userTypeOptions.find(o => o.value === value) ?? userTypeOptions[0]}
							placeholder="Select user type"
							onChangeFn={onChange}
						/>
					)}
				/>
			</FormBox>
		</>
	)
}

export default EditUserFields

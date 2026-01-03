import { Controller } from 'react-hook-form'
import FormBox from '../../../components/Form/FormBox'
import SelectComponent from '../../../components/select/SelectComponent'
import Button from '../../../components/Button'

function CreateCustomerFlow({
	register,
	errors,
	customerEmail,
	existingCustomer,
	customerHasUser,
	openCustomerForm,
	control,
	userRoleOptions,
	userTypeOptions,
}) {
	return (
		<div className="col-12 mt-4">
			<FormBox label="Customer Email" error={errors?.customerEmail?.message} className="mt-4">
				<input
					id="customerEmail"
					className={`input ${errors.customerEmail ? 'input-error' : ''}`}
					{...register('customerEmail', {
						required: 'Customer email is required',
						pattern: {
							value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
							message: 'Invalid email address',
						},
					})}
					placeholder="Enter customer email to check if exists"
				/>
			</FormBox>

			{customerEmail && !existingCustomer && (
				<div className="col-12 mt-3">
					<div className="alert alert-warning">
						<p>
							<strong>Customer not found</strong>
						</p>
						<p>No customer found with email: {customerEmail}</p>
						<Button type="button" onClick={openCustomerForm} className="mt-2">
							Create New Customer
						</Button>
					</div>
				</div>
			)}

			{existingCustomer && customerHasUser && (
				<div className="col-12 mt-3">
					<div className="alert alert-info">
						<p>
							<strong>Customer already has user account</strong>
						</p>
						<p>
							Customer {existingCustomer.name} {existingCustomer.surname} already has a user account.
						</p>
					</div>
				</div>
			)}

			{existingCustomer && !customerHasUser && (
				<>
					<div className="col-12 mt-3">
						<div className="alert alert-success">
							<p>
								<strong>Customer found</strong>
							</p>
							<p>
								Found customer: {existingCustomer.name} {existingCustomer.surname}
							</p>
							<p>Ready to create user account for this customer.</p>
						</div>
					</div>

					{/* user fields */}
					<FormBox label="Login" error={errors?.login?.message} className="mt-4">
						<input
							id="login"
							className={`input ${errors.login ? 'input-error' : ''}`}
							{...register('login', {
								required: 'Login is required',
								minLength: { value: 3, message: 'Login must be at least 3 characters long' },
							})}
						/>
					</FormBox>

					<FormBox label="Password" error={errors?.password?.message} className="mt-4">
						<input
							id="password"
							type="password"
							className={`input ${errors.password ? 'input-error' : ''}`}
							{...register('password', {
								required: 'Password is required',
								minLength: { value: 6, message: 'Password must be at least 6 characters long' },
							})}
						/>
					</FormBox>

					<FormBox label="User Role" error={errors?.userRoleId?.message} className="mt-4">
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

					<FormBox label="User Type" error={errors?.userTypeId?.message} className="mt-4">
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
			)}
		</div>
	)
}

export default CreateCustomerFlow
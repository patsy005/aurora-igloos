import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { addNewEmployee, editEmployee, fetchEmployees } from '../../slices/employeesSlice'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import FormBox from '../../components/Form/FormBox'
import SelectComponent from '../../components/select/SelectComponent'
import Button from '../../components/Button'
import { useModal } from '../../contexts/modalContext'
import Spinner from '../../components/spinner/Spinner'

function EmployeesForm() {
	const employees = useSelector(state => state.employees.employees)
	const employeeRoles = useSelector(state => state.employeeRoles.employeeRoles)

	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const employeeToEdit = props

	// PASSWORD:
	// min 8 characters
	// at least one uppercase letter
	// at least one lowercase letter
	// at least one number
	// at least one special character
	const PASSWORD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			name: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).name : '',
			surname: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).surname : '',
			email: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).email : '',
			phoneNumber: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).phoneNumber : '',
			street: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).street : '',
			streetNumber: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).streetNumber : '',
			houseNumber: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).houseNumber : '',
			city: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).city : '',
			postalCode: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).postalCode : '',
			country: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).country : '',
			roleId: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).roleId : null,
			login: employeeToEdit.id ? employees.find(emp => emp.id === +employeeToEdit.id).login : '',
			password: '',
		},
	})

	const handleCloseModal = () => closeModal()

	const roleOptions = [
		{ value: '', label: 'Select role' },
		...employeeRoles.map(role => ({
			value: role.id,
			label: role.roleName,
		})),
	]

	const onSubmit = data => {
		const formData = new FormData()

		formData.append('Name', data.name)
		formData.append('Surname', data.surname)
		formData.append('Email', data.email)
		formData.append('PhoneNumber', data.phoneNumber)
		formData.append('Street', data.street)
		formData.append('StreetNumber', data.streetNumber)
		formData.append('HouseNumber', data.houseNumber)
		formData.append('City', data.city)
		formData.append('PostalCode', data.postalCode)
		formData.append('Country', data.country)
		formData.append('Login', data.login)
		if (data.password) formData.append('Password', data.password)

		if (data.roleId) formData.append('roleId', data.roleId)

		if (data.img && data.img.length > 0) formData.append('PhotoFile', data.img[0])

		if (employeeToEdit.id) {
			formData.append('Id', employeeToEdit.id)

			dispatch(editEmployee({ id: employeeToEdit.id, updatedEmployee: formData }))
				.unwrap()
				.then(() => {
					toast.success('Employee edited successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchEmployees()))
				.catch(() => toast.error('Error editing employee'))
		} else {
			dispatch(addNewEmployee(formData))
				.unwrap()
				.then(() => {
					toast.success('Employee added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchEmployees()))
				.catch(() => toast.error('Error adding employee'))
		}
	}

	const getEmployeeInfo = () => {
		if (employeeToEdit.id) {
			const user = employees.find(user => user.id === +employeeToEdit.id)
			return user
		}
	}

	useEffect(() => {
		if (employeeToEdit.id) {
			const user = getEmployeeInfo()
			setValue('name', user.name)
			setValue('surname', user.surname)
			setValue('email', user.email)
			setValue('phoneNumber', user.phoneNumber)
			setValue('street', user.street)
			setValue('streetNumber', user.streetNumber)
			setValue('houseNumber', user.houseNumber)
			setValue('city', user.city)
			setValue('postalCode', user.postalCode)
			setValue('country', user.country)
			setValue('roleId', user.roleId)
			setValue('login', user.login)
		}
	}, [employeeToEdit?.id, employees, setValue])

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message} className="mt-4">
				<input
					id="name"
					className={`input ${errors.name ? 'input-error' : ''}`}
					name="name"
					{...register('name', {
						required: 'Name can not be empty',
						minLength: {
							value: 2,
							message: 'Name must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="surname" error={errors?.surname?.message} className="mt-4">
				<input
					id="surname"
					className={`input ${errors.surname ? 'input-error' : ''}`}
					name="surname"
					{...register('surname', {
						required: 'Surname can not be empty',
						minLength: {
							value: 2,
							message: 'Surname must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="e-mail" error={errors?.email?.message}>
				<input
					id="email"
					className={`input ${errors.email ? 'input-error' : ''}`}
					name="email"
					{...register('email', {
						required: 'Email can not be empty',
						pattern: {
							value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
							message: 'Invalid email address',
						},
					})}
				/>
			</FormBox>
			<FormBox label="phoneNumber" error={errors?.phoneNumber?.message}>
				<input
					id="phoneNumber"
					className={`input ${errors.phone ? 'input-error' : ''}`}
					name="phoneNumber"
					placeholder="Without spaces or dashes, e.g. +1234567890"
					{...register('phoneNumber', {
						required: 'Phone number can not be empty',
						pattern: {
							value: /^\+?\d{1,3}(?: ?\d{1,14})?$/,
							message: 'Invalid phone number',
						},
					})}
				/>
			</FormBox>
			<FormBox label="street" error={errors?.street?.message}>
				<input
					id="street"
					className={`input ${errors.street ? 'input-error' : ''}`}
					{...register('street', {
						required: 'Street can not be empty',
						pattern: {
							value: /^[\p{L}\s.'-]+$/u,
							message: 'Street name can contain only letters and spaces',
						},
					})}
				/>
			</FormBox>
			<FormBox label="streetNumber" error={errors?.streetNumber?.message}>
				<input
					id="streetNumber"
					className={`input ${errors.streetNumber ? 'input-error' : ''}`}
					name="streetNumber"
					{...register('streetNumber', {
						required: 'streetNumber can not be empty',
						pattern: {
							value: /^\d+[A-Za-z]?$/,
							message: 'Use format 12 or 12A',
						},
					})}
				/>
			</FormBox>
			<FormBox label="houseNumber" error={errors?.houseNumber?.message}>
				<input
					id="houseNumber"
					className={`input ${errors.street ? 'input-error' : ''}`}
					name="houseNumber"
					{...register('houseNumber', {
						required: false,
						pattern: {
							value: /^\d+([A-Za-z]?)(\/\d+[A-Za-z]?)?$/,
							message: 'Use format 12, 12A, 12/3 or 12A/3B',
						},
					})}
				/>
			</FormBox>
			<FormBox label="city" error={errors?.city?.message}>
				<input
					id="city"
					className={`input ${errors.city ? 'input-error' : ''}`}
					name="city"
					{...register('city', {
						required: 'City can not be empty',
						minLength: {
							value: 2,
							message: 'City must be at least 2 characters long',
						},
						pattern: {
							value: /^[\p{L}\s-]+$/u,
							message: 'City must contain only letters',
						},
					})}
				/>
			</FormBox>
			<FormBox label="postalCode" error={errors?.postalCode?.message}>
				<input
					id="postalCode"
					className={`input ${errors.postalCode ? 'input-error' : ''}`}
					name="postalCode"
					{...register('postalCode', {
						required: 'Postal code can not be empty',
						pattern: {
							value: /^[\p{L}0-9\s-]+$/u,
							message: 'Invalid postal code format',
						},
					})}
				/>
			</FormBox>
			<FormBox label="country" error={errors?.country?.message}>
				<input
					id="country"
					className={`input ${errors.country ? 'input-error' : ''}`}
					name="country"
					{...register('country', {
						required: 'Country can not be empty',
						minLength: {
							value: 2,
							message: 'Country must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<div className="form__box col-12 col-sm-5">
				<label className="label">Role</label>
				<Controller
					name="roleId"
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="roleId"
							className={`react-select ${errors.roleId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="roleId"
							options={roleOptions}
							value={roleOptions.find(option => option.value === value) ?? roleOptions[0]}
							placeholder="Select role"
							onChangeFn={onChange}
						/>
					)}
				/>
				{errors.roleId && <p className="error-msg">You must choose role</p>}
			</div>
			<FormBox label="login" error={errors?.login?.message}>
				<input
					id="login"
					className={`input ${errors.login ? 'input-error' : ''}`}
					name="login"
					{...register('login', {
						required: 'Login can not be empty',
						minLength: {
							value: 2,
							message: 'Login must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="password" error={errors?.password?.message}>
				<input
					id="password"
					className={`input ${errors.password ? 'input-error' : ''}`}
					name="password"
					{...register('password', {
						pattern: {
							value: PASSWORD_REGEX,
							message:
								'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
						},
						validate: value => {
							if (!employeeToEdit.id && value === '') {
								return 'Password is required for new employees'
							}
							return true
						},
					})}
				/>
			</FormBox>

			<FormBox label="Image" error={errors?.img?.message} labelClassName="file-upload">
				<input
					type="file"
					accept="image/png, image/jpeg"
					id="img"
					className={`input ${errors.img ? 'input-error' : ''}`}
					name="img"
					{...register('img', {
						// validate: value => value[0].size < 1000000 || 'Image size must be less than 1MB',
					})}
				/>
			</FormBox>

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						handleCloseModal()
					}}
					type={'button'}>
					Cancel
				</Button>
				<Button type={'submit'}>
					{isFormLoading && <Spinner className="form" />}
					{!isFormLoading && (employeeToEdit.id ? 'Save changes' : 'Add employee')}
				</Button>
			</div>
		</form>
	)
}

export default EmployeesForm

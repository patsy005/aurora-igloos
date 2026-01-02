import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { addNewCustomer, editCustomer, fetchCustomers } from '../../slices/customersSLice'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import FormBox from '../../ui/Form/FormBox'
import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'

function CustomersForm() {
	const customers = useSelector(state => state.customers.customers)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const customerToEdit = props

	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors, isValid, isLoading: isFormLoading },
	} = useForm({
		defaultValues: {
			name: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).name : '',
			surname: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).surname : '',
			email: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).email : '',
			phone: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).phoneNumber : '',
			street: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).street : '',
			streetNumber: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).streetNumber : '',
			houseNumber: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).houseNumber : '',
			city: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).city : '',
			postalCode: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).postalCode : '',
			country: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).country : '',
			createUser: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).createUser : false,
			login: customerToEdit.id ? customers.find(emp => emp.id === +customerToEdit.id).login : '',
			password: '',
		},
	})

	// PASSWORD:
	// min 8 characters
	// at least one uppercase letter
	// at least one lowercase letter
	// at least one number
	// at least one special character
	const PASSWORD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/

	const createUser = watch('createUser')

	const handleCloseModal = () => closeModal()

	const onSubmit = data => {
		console.log(data)

		const newCustomer = {
			name: data.name,
			surname: data.surname,
			email: data.email,
			phone: data.phone,
			street: data.street,
			streetNumber: data.streetNumber,
			houseNumber: data.houseNumber,
			city: data.city,
			postalCode: data.postalCode,
			country: data.country,
			createUser: data.createUser,
		}

		if (data.createUser) {
			newCustomer.login = data.login
			newCustomer.password = data.password
		}

		if (customerToEdit.id) {
			dispatch(editCustomer({ id: customerToEdit.id, updatedCustomer: { ...newCustomer, id: customerToEdit.id, login: data.login, password: data.password } }))
				.unwrap()
				.then(() => {
					toast.success('Customer edited successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchCustomers()))
				.catch(() => {
					toast.error('Failed to edit customer')
				})
		} else {
			dispatch(addNewCustomer(newCustomer))
				.unwrap()
				.then(() => {
					toast.success('Customer added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchCustomers()))
				.catch(() => {
					toast.error('Failed to add customer')
				})
		}
	}

	const getCustomerInfo = () => {
		if (customerToEdit.id) {
			const customer = customers.find(customer => customer.id === +customerToEdit.id)
			return { customer }
		}
	}

	useEffect(() => {
		if (customerToEdit.id) {
			const { customer } = getCustomerInfo()
			setValue('name', customer.name)
			setValue('surname', customer.surname)
			setValue('email', customer.email)
			setValue('phone', customer.phone)
			setValue('street', customer.street)
			setValue('streetNumber', customer.streetNumber)
			setValue('houseNumber', customer.houseNumber)
			setValue('city', customer.city)
			setValue('postalCode', customer.postalCode)
			setValue('country', customer.country)
			setValue('createUser', customer.createUser)
			setValue('login', customer.login)
		}
	}, [customerToEdit.id])

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message}>
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
			<FormBox label="surname" error={errors?.surname?.message}>
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
			<FormBox label="phone" error={errors?.phone?.message}>
				<input
					id="phone"
					className={`input ${errors.phone ? 'input-error' : ''}`}
					name="phone"
					{...register('phone', {
						required: 'Phone number can not be empty',
						pattern: {
							value: /^\+?[1-9]\d{1,14}$/,
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
			<FormBox label="create user" error={errors?.country?.message}>
				{/* <div className="radioBtn">
					<input
						className="radio-input"
						type="radio"
						value="createUser"
						name="createUser"
						{...register('createUser')}
						checked={createUser === true}
						onChange={e => handlePaymentChange(e.target.value)}
					/>
				</div> */}
				<input id="createUser" type="checkbox" className="checkbox-input" {...register('createUser')} />
			</FormBox>

			{createUser && (
				<>
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
									if (!customerToEdit.id && value === '') {
										return 'Password is required for new employees'
									}
									return true
								},
							})}
						/>
					</FormBox>
				</>
			)}

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
					{!isFormLoading && (customerToEdit.id ? 'Save changes' : 'Add customer')}
				</Button>
			</div>
		</form>
	)
}

export default CustomersForm

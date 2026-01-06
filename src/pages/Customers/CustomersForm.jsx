import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { addNewCustomer, editCustomer, fetchCustomers } from '../../slices/customersSLice'
import toast from 'react-hot-toast'
import { useEffect, useMemo } from 'react'
import FormBox from '../../components/Form/FormBox'
import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'

function CustomersForm() {
	const customers = useSelector(state => state.customers.customers)
	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const customerToEdit = props

	const selectedCustomer = useMemo(() => {
		if (!customerToEdit?.id) return null
		return customers.find(c => c.id === +customerToEdit.id) ?? null
	}, [customerToEdit?.id, customers])

	const isUser = !!selectedCustomer?.idUser

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
		setValue,
		watch,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			name: selectedCustomer?.name ?? '',
			surname: selectedCustomer?.surname ?? '',
			email: selectedCustomer?.email ?? '',
			phone: selectedCustomer?.phoneNumber ?? selectedCustomer?.phone ?? '',
			street: selectedCustomer?.street ?? '',
			streetNumber: selectedCustomer?.streetNumber ?? '',
			houseNumber: selectedCustomer?.houseNumber ?? '',
			city: selectedCustomer?.city ?? '',
			postalCode: selectedCustomer?.postalCode ?? '',
			country: selectedCustomer?.country ?? '',

			createUser: false,

			login: selectedCustomer?.login ?? '',
			password: '',
		},
	})

	const createUser = watch('createUser')

	const handleCloseModal = () => closeModal()

	useEffect(() => {
		if (!selectedCustomer) return

		setValue('name', selectedCustomer.name ?? '')
		setValue('surname', selectedCustomer.surname ?? '')
		setValue('email', selectedCustomer.email ?? '')
		setValue('phone', selectedCustomer.phoneNumber ?? selectedCustomer.phone ?? '')
		setValue('street', selectedCustomer.street ?? '')
		setValue('streetNumber', selectedCustomer.streetNumber ?? '')
		setValue('houseNumber', selectedCustomer.houseNumber ?? '')
		setValue('city', selectedCustomer.city ?? '')
		setValue('postalCode', selectedCustomer.postalCode ?? '')
		setValue('country', selectedCustomer.country ?? '')

		// login jeśli jest
		setValue('login', selectedCustomer.login ?? '')

		if (selectedCustomer.idUser) {
			setValue('createUser', false)
		}

		// hasło zawsze puste w edycji
		setValue('password', '')
	}, [selectedCustomer, setValue])

	const onSubmit = data => {
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
		}

		// ifcustomer już jest userem -> tylko login (+ opcjonalnie password jeśli wpisane)
		if (isUser) {
			newCustomer.login = data.login
			if (data.password && data.password.trim() !== '') {
				newCustomer.password = data.password
			}
			newCustomer.createUser = false
		}

		// if nie jest userem i zaznaczono createUser -> tworzymy konto
		if (!isUser && data.createUser) {
			newCustomer.createUser = true
			newCustomer.login = data.login
			newCustomer.password = data.password
		}

		// if nie jest userem i createUser = false
		if (!isUser && !data.createUser) {
			newCustomer.createUser = false
		}

		if (customerToEdit?.id) {
			dispatch(
				editCustomer({
					id: customerToEdit.id,
					updatedCustomer: {
						...newCustomer,
						id: customerToEdit.id,
					},
				})
			)
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

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message}>
				<input
					id="name"
					className={`input ${errors.name ? 'input-error' : ''}`}
					name="name"
					{...register('name', {
						required: 'Name can not be empty',
						minLength: { value: 2, message: 'Name must be at least 2 characters long' },
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
						minLength: { value: 2, message: 'Surname must be at least 2 characters long' },
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
						pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Invalid phone number' },
					})}
				/>
			</FormBox>

			<FormBox label="street" error={errors?.street?.message}>
				<input
					id="street"
					className={`input ${errors.street ? 'input-error' : ''}`}
					{...register('street', {
						required: 'Street can not be empty',
						pattern: { value: /^[\p{L}\s.'-]+$/u, message: 'Street name can contain only letters and spaces' },
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
						pattern: { value: /^\d+[A-Za-z]?$/, message: 'Use format 12 or 12A' },
					})}
				/>
			</FormBox>

			<FormBox label="houseNumber" error={errors?.houseNumber?.message}>
				<input
					id="houseNumber"
					className={`input ${errors.houseNumber ? 'input-error' : ''}`}
					name="houseNumber"
					{...register('houseNumber', {
						required: false,
						pattern: { value: /^\d+([A-Za-z]?)(\/\d+[A-Za-z]?)?$/, message: 'Use format 12, 12A, 12/3 or 12A/3B' },
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
						minLength: { value: 2, message: 'City must be at least 2 characters long' },
						pattern: { value: /^[\p{L}\s-]+$/u, message: 'City must contain only letters' },
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
						pattern: { value: /^[\p{L}0-9\s-]+$/u, message: 'Invalid postal code format' },
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
						minLength: { value: 2, message: 'Country must be at least 2 characters long' },
					})}
				/>
			</FormBox>

			{/*  TYLKO jeśli customer NIE jest userem */}
			{!isUser && (
				<FormBox label="create user" error={errors?.createUser?.message}>
					<input id="createUser" type="checkbox" className="checkbox-input" {...register('createUser')} />
				</FormBox>
			)}

			{/*  LOGIN: jeśli customer jest userem -> pokazuj zawsze */}
			{isUser && (
				<FormBox label="login" error={errors?.login?.message}>
					<input
						id="login"
						className={`input ${errors.login ? 'input-error' : ''}`}
						name="login"
						{...register('login', {
							required: 'Login can not be empty',
							minLength: { value: 2, message: 'Login must be at least 2 characters long' },
						})}
					/>
				</FormBox>
			)}

			{/* PASSWORD (opcjonalne) dla existing user — jak wpiszesz, backend zmieni */}
			{isUser && (
				<FormBox label="password" error={errors?.password?.message}>
					<input
						id="password"
						type="password"
						className={`input ${errors.password ? 'input-error' : ''}`}
						name="password"
						{...register('password', {
							pattern: {
								value: PASSWORD_REGEX,
								message:
									'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
							},
						})}
					/>
				</FormBox>
			)}

			{/* LOGIN + PASSWORD: tylko gdy nie ma idUser i createUser = true */}
			{!isUser && createUser && (
				<>
					<FormBox label="login" error={errors?.login?.message}>
						<input
							id="login"
							className={`input ${errors.login ? 'input-error' : ''}`}
							name="login"
							{...register('login', {
								required: 'Login can not be empty',
								minLength: { value: 2, message: 'Login must be at least 2 characters long' },
							})}
						/>
					</FormBox>

					<FormBox label="password" error={errors?.password?.message}>
						<input
							id="password"
							type="password"
							className={`input ${errors.password ? 'input-error' : ''}`}
							name="password"
							{...register('password', {
								pattern: {
									value: PASSWORD_REGEX,
									message:
										'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
								},
								validate: value => {
									if (value === '') return 'Password is required for new users'
									return true
								},
							})}
						/>
					</FormBox>
				</>
			)}

			<div className="d-flex justify-content-end text-end form-btns">
				<Button className="cancel-btn" onClick={handleCloseModal} type={'button'}>
					Cancel
				</Button>

				<Button type={'submit'}>
					{isFormLoading && <Spinner className="form" />}
					{!isFormLoading && (customerToEdit?.id ? 'Save changes' : 'Add customer')}
				</Button>
			</div>
		</form>
	)
}

export default CustomersForm

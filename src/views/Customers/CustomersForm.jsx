import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setIsCreating, setIsEditing } from '../../slices/customersSLice'
import { useForm } from 'react-hook-form'
import FormBox from '../../ui/Form/FormBox'
import Button from '../../components/Button'

function CustomersForm() {
	const { customerId } = useParams()
	const isEditing = useSelector(state => state.customers.isEditing)
	const customers = data.customers
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(() => {
		if (customerId) {
			dispatch(setIsEditing(true))
		}
	})

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isValid },
	} = useForm()

	const onSubmit = data => {
		console.log(data)
		dispatch(setIsCreating(false))
	}

	const getCustomerInfo = () => {
		if (customerId) {
			const customer = customers.find(customer => customer.id === +customerId)
			return { customer }
		}
	}

	useEffect(() => {
		if (customerId) {
			const { customer } = getCustomerInfo()
			setValue('name', customer.name)
			setValue('surname', customer.surname)
			setValue('email', customer.email)
			setValue('phone', customer.phoneNumber)
			setValue('nationality', customer.nationality)
		}
	}, [])

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message}>
				<input
					id="name"
					className={`input ${errors.name ? 'input-error' : ''}`}
					name="name"
					{...register('name', { required: 'Name can not be empty' })}
				/>
			</FormBox>
			<FormBox label="surname" error={errors?.surname?.message}>
				<input
					id="surname"
					className={`input ${errors.surname ? 'input-error' : ''}`}
					name="surname"
					{...register('surname', { required: 'Surname can not be empty' })}
				/>
			</FormBox>
			<FormBox label="e-mail" error={errors?.email?.message}>
				<input
					id="email"
					className={`input ${errors.email ? 'input-error' : ''}`}
					name="email"
					{...register('email', { required: 'Email can not be empty' })}
				/>
			</FormBox>
			<FormBox label="phone" error={errors?.phone?.message}>
				<input
					id="phone"
					className={`input ${errors.phone ? 'input-error' : ''}`}
					name="phone"
					{...register('phone', { required: 'Phone number can not be empty' })}
				/>
			</FormBox>
			<FormBox label="nationality" error={errors?.nationality?.message}>
				<input
					id="nationality"
					className={`input ${errors.nationality ? 'input-error' : ''}`}
					name="nationality"
					{...register('nationality', { required: 'Nationality number can not be empty' })}
				/>
			</FormBox>

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						dispatch(setIsCreating(false))
						dispatch(setIsEditing(false))
						customerId && navigate(-1)
					}}>
					Cancel
				</Button>
				<Button>{isEditing ? 'Edit customer' : 'Add customer'}</Button>
			</div>
		</form>
	)
}

export default CustomersForm

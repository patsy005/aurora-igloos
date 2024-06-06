/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import data from '../../../public/data.json'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import FormBox from '../Form/FormBox'
import Button from '../../components/Button'
import { setIsCreating, setIsEditing } from '../../slices/usersSlice'
import { useEffect } from 'react'
import { useState } from 'react'
import ReactSelect from 'react-select'
import toast, { Toaster } from 'react-hot-toast'

function UsersForm() {
	const users = data.users
	const isEditing = useSelector(state => state.users.isEditing)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { userId } = useParams()
	const [status, setStatus] = useState(userId ? users.find(user => user.id === +userId).status : '')
	const [role, setRole] = useState(userId ? users.find(user => user.id === +userId).role : '')

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isValid },
	} = useForm()

	const statusOptions = users.map(user => ({ value: user.status, label: user.status }))
	const roleOptions = users.map(user => ({ value: user.role, label: user.role }))

	const onStatusChange = status => {
		setStatus(status)
		setValue('status', status)
	}

	const onRoleChange = role => {
		setRole(role)
		setValue('role', role)
	}

	const onSubmit = data => {
		console.log(data)
		dispatch(setIsCreating(false))
		userId ? toast.success('User edited successfully') : toast.success('User added successfully')
		
		userId && navigate(-1)
	}

	const getUserInfo = () => {
		if (userId) {
			const user = users.find(user => user.id === +userId)
			return user
		}
	}

	useEffect(() => {
		if (userId) {
			const user = getUserInfo()
			setValue('name', user.name)
			setValue('surname', user.surname)
			setValue('email', user.email)
			setValue('phone', user.phoneNumber)
			setValue('street', user.address.street)
			setValue('city', user.address.city)
			setValue('postal', user.address.postalCode)
			setValue('country', user.address.country)
			setValue('status', user.status)
			setValue('role', user.role)
		}
	})

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
					placeholder='Without spaces or dashes, e.g. +1234567890'
					{...register('phone', {
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
					name="street"
					placeholder={!isEditing ? 'With home number' : ''}
					{...register('street', {
						required: 'Street can not be empty',
						pattern: {
							value: /^[\p{L}\d\s.,#'-]+ \d+$/u,
							message: 'Street must be in format: Street name 123',
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
			<FormBox label="postal" error={errors?.postal?.message}>
				<input
					id="postal"
					className={`input ${errors.postal ? 'input-error' : ''}`}
					name="postal"
					{...register('postal', {
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
				<label className="label">Status</label>
				<Controller
					name="status"
					control={control}
					rules={{ required: true }}
					render={() => (
						<ReactSelect
							defaultValue={userId ? status : []}
							options={statusOptions}
							classNamePrefix="react-select"
							onChange={onStatusChange}
						/>
					)}
				/>
				{errors.status && <p className="error-msg">You must choose status</p>}
			</div>
			<div className="form__box col-12 col-sm-5">
				<label className="label">Role</label>
				<Controller
					name="role"
					control={control}
					rules={{ required: true }}
					render={() => (
						<ReactSelect
							defaultValue={userId ? role : []}
							options={roleOptions}
							classNamePrefix="react-select"
							onChange={onRoleChange}
						/>
					)}
				/>
				{errors.role && <p className="error-msg">You must choose role</p>}
			</div>

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						dispatch(setIsCreating(false))
						dispatch(setIsEditing(false))
						userId && navigate('/users')
					}}>
					Cancel
				</Button>
				<Button>{userId ? 'Edit user' : 'Add user'}</Button>
			</div>
		</form>
	)
}

export default UsersForm

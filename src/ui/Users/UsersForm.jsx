/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import data from '../../../public/data.json'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import FormBox from '../Form/FormBox'
import Button from '../../components/Button'
import { setIsCreating, setIsEditing } from '../../slices/usersSlice'
import { useEffect } from 'react'

function UsersForm() {
	const users = data.users
	const isEditing = useSelector(state => state.users.isEditing)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { userId } = useParams()
	const statusArr = ['active', 'inactive']
	const roleArr = ['admin', 'receptionist', 'user']

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isValid },
	} = useForm()

	const onSubmit = data => {
		console.log(data)
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
			setValue('phone', user.phone)
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
					type="number"
					{...register('phone', { required: 'Phone can not be empty' })}
				/>
			</FormBox>
			<FormBox label="street" error={errors?.street?.message}>
				<input
					id="street"
					className={`input ${errors.street ? 'input-error' : ''}`}
					name="street"
					placeholder={!isEditing ? 'With home number' : ''}
					{...register('street', { required: 'Street can not be empty' })}
				/>
			</FormBox>
			<FormBox label="city" error={errors?.city?.message}>
				<input
					id="city"
					className={`input ${errors.city ? 'input-error' : ''}`}
					name="city"
					{...register('city', { required: 'City can not be empty' })}
				/>
			</FormBox>
			<FormBox label="postal" error={errors?.postal?.message}>
				<input
					id="postal"
					className={`input ${errors.postal ? 'input-error' : ''}`}
					name="postal"
					{...register('postal', { required: 'Postal code can not be empty' })}
				/>
			</FormBox>
			<FormBox label="country" error={errors?.country?.message}>
				<input
					id="country"
					className={`input ${errors.country ? 'input-error' : ''}`}
					name="country"
					{...register('country', { required: 'Postal code can not be empty' })}
				/>
			</FormBox>
			<div className="form__box col-12 col-sm-5">
				<label className="label">Status</label>
				<select className="input igloos-dropdown" {...register('status', { required: true })}>
					{statusArr.map((status, index) => {
						return (
							<option key={index} value={status}>
								{status}
							</option>
						)
					})}
				</select>
				{errors.status && <p className="error-msg">You must choose status</p>}
			</div>
			<div className="form__box col-12 col-sm-5">
				<label className="label">Role</label>
				<select className="input igloos-dropdown" {...register('role', { required: true })}>
					{roleArr.map((role, index) => {
						return (
							<option key={index} value={role}>
								{role}
							</option>
						)
					})}
				</select>
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
				<Button>{isEditing ? 'Edit user' : 'Add user'}</Button>
			</div>
		</form>
	)
}

export default UsersForm

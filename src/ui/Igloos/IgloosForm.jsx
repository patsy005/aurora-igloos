import ReactDatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import Button from '../Button'
import FormBox from '../Form/FormBox'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIgloos } from '../../slices/IglooSlice'
import { setIsCreating, setIsEditing } from '../../slices/bookings'
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'

function IgloosForm() {
	const isEditing = useSelector(state => state.igloos.isEditing)
	const igloos = useSelector(state => state.igloos?.igloos)

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

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message}>
				<input
					type="text"
					id="name"
					className={`input ${errors.name ? 'input-error' : ''}`}
					name="name"
					{...register('name', { required: 'Igloo name is required' })}
				/>
			</FormBox>
			<FormBox label="capacity" error={errors?.capacity?.message}>
				<input
					type="text"
					id="capacity"
					className={`input ${errors.capacity ? 'input-error' : ''}`}
					name="capacity"
					{...register('capacity', { required: 'Igloo capacity is required' })}
				/>
			</FormBox>
			<FormBox label="price" error={errors?.price?.message}>
				<input
					type="text"
					id="price"
					className={`input ${errors.price ? 'input-error' : ''}`}
					name="price"
					{...register('price', { required: 'Igloo price is required' })}
				/>
			</FormBox>
			<FormBox label="img" error={errors?.img?.message}>
				<input
					type="file"
					accept="image/png, image/jpeg"
					id="img"
					className={`input ${errors.img ? 'input-error' : ''}`}
					name="img"
					{...register('price', { required: 'Igloo image is required' })}
				/>
			</FormBox>
		</form>
	)
}

export default IgloosForm

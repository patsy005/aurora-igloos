import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import Button from '../Button'
import FormBox from '../Form/FormBox'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { setIsCreating, setIsEditing } from '../../slices/IglooSlice'

function IgloosForm() {
	const { iglooId } = useParams()
	const isEditing = useSelector(state => state.igloos.isEditing)
	const isCreating = useSelector(state => state.igloos.isCreating)
	const igloos = data.igloos
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid },
	} = useForm()

	const onSubmit = data => {
		console.log(data)
	}

	const getIglooInfo = () => {
		if (iglooId) {
			const igloo = igloos.find(igloo => igloo.id === +iglooId)
			return igloo
		}
	}


	useEffect(() => {
		if(iglooId){
			const igloo = getIglooInfo()
			setValue('name', igloo.name)
			setValue('capacity', igloo.capacity)
			setValue('price', igloo.pricePerNight)
		}
	})

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
			<FormBox label="img" error={errors?.img?.message} labelClassName="file-upload">
				<input
					type="file"
					accept="image/png, image/jpeg"
					id="img"
					className={`input ${errors.img ? 'input-error' : ''}`}
					name="img"
					{...register('img', { required: 'Igloo image is required' })}
				/>
			</FormBox>

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						dispatch(setIsCreating(false))
						dispatch(setIsEditing(false))
						iglooId && navigate('/igloos')
					}}>
					Cancel
				</Button>
				<Button>Add booking</Button>
			</div>
		</form>
	)
}

export default IgloosForm

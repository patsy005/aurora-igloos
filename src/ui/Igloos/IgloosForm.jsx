/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import Button from '../../components/Button'
import FormBox from '../Form/FormBox'
import { useDispatch } from 'react-redux'

import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { setIsCreating, setIsEditing } from '../../slices/IglooSlice'
import toast from 'react-hot-toast'

function IgloosForm() {
	const { iglooId } = useParams()
	const igloos = data.igloos
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: iglooId ? igloos.find(igloo => igloo.id === +iglooId).name : '',
			capacity: iglooId ? igloos.find(igloo => igloo.id === +iglooId).capacity : '',
			price: iglooId ? igloos.find(igloo => igloo.id === +iglooId).pricePerNight : '',
		},
	})

	const onSubmit = data => {
		console.log(data)
		dispatch(setIsCreating(false))
		iglooId ? toast.success('Igloo edited successfully') : toast.success('Igloo added successfully')
		iglooId && navigate(-1)
	}

	const getIglooInfo = () => {
		if (iglooId) {
			const igloo = igloos.find(igloo => igloo.id === +iglooId)
			return igloo
		}
	}

	useEffect(() => {
		if (iglooId) {
			const igloo = getIglooInfo()
			setValue('name', igloo.name)
			setValue('capacity', igloo.capacity)
			setValue('price', igloo.pricePerNight)
		}
	}, [])

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message}>
				<input
					type="text"
					id="name"
					className={`input ${errors.name ? 'input-error' : ''}`}
					name="name"
					{...register('name', {
						required: 'Name can not be empty',
						minLength: {
							value: 2,
							message: 'Igloo name must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="capacity" error={errors?.capacity?.message}>
				<input
					type="text"
					id="capacity"
					className={`input ${errors.capacity ? 'input-error' : ''}`}
					name="capacity"
					{...register('capacity', {
						required: 'Igloo capacity is required',
						min: {
							value: 1,
							message: 'Igloo capacity must be at least 1 person',
						},
					})}
				/>
			</FormBox>
			<FormBox label="price" error={errors?.price?.message}>
				<input
					type="text"
					id="price"
					className={`input ${errors.price ? 'input-error' : ''}`}
					name="price"
					{...register('price', {
						required: 'Igloo price is required',
						min: {
							value: 1,
							message: 'Igloo price must be at least $1',
						},
					})}
				/>
			</FormBox>
			<FormBox label="img" error={errors?.img?.message} labelClassName="file-upload">
				<input
					type="file"
					accept="image/png, image/jpeg"
					id="img"
					className={`input ${errors.img ? 'input-error' : ''}`}
					name="img"
					{...register('img', {
						required: 'Igloo image is required',
						validate: value => value[0].size < 1000000 || 'Image size must be less than 1MB',
					})}
				/>
			</FormBox>

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						dispatch(setIsCreating(false))
						dispatch(setIsEditing(false))
						iglooId && navigate(-1)
					}}>
					Cancel
				</Button>
				<Button>{!iglooId ? 'Add igloo' : 'Edit igloo'}</Button>
			</div>
		</form>
	)
}

export default IgloosForm

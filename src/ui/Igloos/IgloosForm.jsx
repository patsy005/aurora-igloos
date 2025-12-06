/* eslint-disable no-unused-vars */
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import FormBox from '../Form/FormBox'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { addNewIgloo, editIgloo, setIsCreating, setIsEditing } from '../../slices/igloosSlice'
import toast from 'react-hot-toast'
import SelectComponent from '../../components/select/SelectComponent'
import { closeModal, selectModalProps } from '../../slices/modalSlice'

function IgloosForm() {
	const iglooToEdit = useSelector(selectModalProps)

	const igloos = useSelector(state => state.igloos.igloos)
	const discounts = useSelector(state => state.discounts.discounts)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	console.log(iglooToEdit)

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors, isLoading: isFormLoading },
	} = useForm({
		defaultValues: {
			name: iglooToEdit.id ? igloos.find(igloo => igloo.id === +iglooToEdit.id).name : '',
			capacity: iglooToEdit.id ? igloos.find(igloo => igloo.id === +iglooToEdit.id).capacity : '',
			price: iglooToEdit.id ? igloos.find(igloo => igloo.id === +iglooToEdit.id).pricePerNight : '',
			description: iglooToEdit.id ? igloos.find(igloo => igloo.id === +iglooToEdit.id).description : '',
			img: iglooToEdit.id ? igloos.find(igloo => igloo.id === +iglooToEdit.id).photoUrl : '',
			idDiscount: iglooToEdit.id ? igloos.find(igloo => igloo.id === +iglooToEdit.id).idDiscount : null,
		},
	})

	const handleCloseModal = () => dispatch(closeModal())

	const discountOptions = [
		{ value: '', label: 'No discount' },
		...discounts.map(discount => ({
			value: discount.id,
			label: discount.name,
		})),
	]

	const onSubmit = data => {
		const formData = new FormData()

		formData.append('Name', data.name)
		formData.append('Capacity', data.capacity)
		formData.append('PricePerNight', data.price)
		formData.append('Description', data.description ?? '')


		if (data.idDiscount !== null) {
			formData.append('IdDiscount', data.idDiscount)
		}

		if (data.img && data.img.length > 0) {
			formData.append('PhotoFile', data.img[0])
		}

		if (iglooToEdit.id) {
			setFormTitle('Edit igloo')
			formData.append('Id', iglooToEdit.id)
			dispatch(editIgloo({ id: iglooToEdit.id, updatedIgloo: formData }))
				.unwrap()
				.then(() => toast.success('Igloo edited successfully'))
				.then(() => navigate(-1))
				.catch(() => toast.error('Failed to edit igloo'))
		} else {
			console.log(formData)
			dispatch(addNewIgloo(formData))
				.unwrap()
				.then(() => toast.success('Igloo added successfully'))
				.then(() => navigate(-1))
				.catch(() => toast.error('Failed to add igloo'))
		}

		for (const [k, v] of formData.entries()) {
			console.log(k, v)
		}
	}

	const getIglooInfo = () => {
		if (iglooToEdit.id) {
			const igloo = igloos.find(igloo => igloo.id === +iglooToEdit.id)
			return igloo
		}
	}

	useEffect(() => {
		if (iglooToEdit.id) {
			const igloo = getIglooInfo()
			setValue('name', igloo.name)
			setValue('capacity', igloo.capacity)
			setValue('price', igloo.pricePerNight)
			setValue('description', igloo.description)
			setValue('idDiscount', igloo.idDiscount ?? null)
		}
	}, [])

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h3 className='form-title'>{iglooToEdit.id ? 'Edit Igloo' : 'Add Igloo'}</h3>
			<FormBox label="name" error={errors?.name?.message} className='mt-4'>
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
			<FormBox label="capacity" error={errors?.capacity?.message} className='mt-4'>
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
			<FormBox label="price per night" error={errors?.price?.message}>
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

			<FormBox label="Description" error={errors?.description?.message}>
				<input
					type="text"
					id="description"
					className={`input ${errors.description ? 'input-error' : ''}`}
					name="description"
					{...register('description')}
				/>
			</FormBox>

			<FormBox label={'Discount'} error={errors?.idDiscount?.message}>
				<Controller
					control={control}
					name="idDiscount"
					// rules={{
					// 	required: 'Please select a discount',
					// 	validate: value => value !== '' || 'Please select a discount',
					// }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="idDiscount"
							className={`react-select ${errors.idDiscount ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="idDiscount"
							options={discountOptions}
							// {...register('idDiscount')}
							value={discountOptions.find(option => option.value === value) ?? discountOptions[0]}
							placeholder="Select discount"
							onChangeFn={onChange}
						/>
					)}
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
				<Button type={'submit'}>{!iglooToEdit.id ? 'Add igloo' : 'Edit igloo'}</Button>
			</div>
		</form>
	)
}

export default IgloosForm

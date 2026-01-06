import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { addNewDiscount, editDiscount } from '../../slices/discountsSlice'
import toast from 'react-hot-toast'
import FormBox from '../../components/Form/FormBox'
import ReactDatePicker from 'react-datepicker'
import { DatePickerIcon } from '../../ui/Icons'
import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'

function DiscountsForm() {
	const discounts = useSelector(state => state.discounts.discounts)
	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const discountToEdit = props

	const [validFrom, setValidFrom] = useState(
		discountToEdit.id ? discounts.find(promo => promo.id === +discountToEdit.id).validFrom : null
	)
	const [validTo, setValidTo] = useState(
		discountToEdit.id ? discounts.find(promo => promo.id === +discountToEdit.id).validTo : null
	)

	const formatDateOnly = date => {
		if (!date) return null
		const year = date.getFullYear()

		// padStart ensures two digits
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const parseDateOnly = string => {
		if (!string) return null
		return new Date(string + 'T00:00:00')
	}

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			name: discountToEdit.id ? discounts.find(discount => discount.id === +discountToEdit.id).name : '',
			discount: discountToEdit?.id ? discounts.find(discount => discount.id === +discountToEdit.id).discount : '',
			description: discountToEdit?.id ? discounts.find(discount => discount.id === +discountToEdit.id).description : '',
			dates: discountToEdit?.id
				? [
						parseDateOnly(discounts.find(discount => discount.id === +discountToEdit.id).validFrom),
						parseDateOnly(discounts.find(discount => discount.id === +discountToEdit.id).validTo),
				  ]
				: [null, null],
		},
	})

	const handleCloseModal = () => closeModal()

	const onSubmit = data => {
		const [validFrom, validTo] = data.dates

		const newDiscount = {
			name: data.name,
			discount: +data.discount,
			description: data.description,
			validFrom: formatDateOnly(validFrom),
			validTo: formatDateOnly(validTo),
		}

		if (discountToEdit.id) {
			dispatch(editDiscount({ id: +discountToEdit.id, updatedDiscount: { ...newDiscount, id: +discountToEdit.id } }))
				.unwrap()
				.then(() => {
					toast.success('Discount edited successfully')
					handleCloseModal()
				})
				.catch(() => {
					toast.error('Failed to edit discount')
				})
		} else {
			dispatch(addNewDiscount(newDiscount))
				.unwrap()
				.then(() => {
					toast.success('Discount added successfully')
					handleCloseModal()
				})
				.catch(() => {
					toast.error('Failed to add discount')
				})
		}
	}

	const getPromoInfo = () => {
		if (discountToEdit.id) {
			const promo = discounts.find(promo => promo.id === +discountToEdit.id)
			return promo
		}
	}

	useEffect(() => {
		if (discountToEdit.id) {
			const promo = getPromoInfo()
			setValue('name', promo.name)
			setValue('discount', parseInt(promo.discount))
			setValue('description', promo.description)
			setValue('dates', [parseDateOnly(promo.validFrom), parseDateOnly(promo.validTo)])
		}
	}, [])

	const onChangeDate = dates => {
		const [start, end] = dates
		setValidFrom(start)
		setValidTo(end)
		setValue('dates', [start, end])
	}

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h3 className="form-title">{discountToEdit.id ? 'Edit Discount' : 'Add Discount'}</h3>
			<FormBox label="name" error={errors?.name?.message} className="mt-4">
				<input
					type="text"
					id="name"
					className={`input ${errors.name ? 'input-error' : ''}`}
					name="name"
					{...register('name', {
						required: 'Igloo name is required',
						minLength: {
							value: 2,
							message: 'Igloo name must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="discount" error={errors?.discount?.message} className="mt-4">
				<input
					type="number"
					id="discount"
					placeholder={discountToEdit.id ? discounts.find(promo => promo.id === +discountToEdit.id).discount : 'In %'}
					className={`input ${errors.discount ? 'input-error' : ''}`}
					name="discount"
					{...register('discount', {
						required: 'Discount is required',
						min: {
							value: 1,
							message: 'Discount must be at least 1',
						},
					})}
				/>
			</FormBox>
			<FormBox label="description" error={errors?.description?.message}>
				<input
					id="description"
					className={`input ${errors.description ? 'input-error' : ''}`}
					name="description"
					{...register('description', {
						required: 'Description is required',
						minLength: {
							value: 2,
							message: 'Description must be at least 2 characters long',
						},

						maxLength: {
							value: 50,
							message: 'Description must be at least 2 characters long',
						},
						pattern: {
							value: /^[\s\S]*$/,
							message: 'Description contains invalid characters',
						},
					})}
				/>
			</FormBox>
			<div className="form__box col-12 col-sm-5">
				<label className="label">Dates</label>
				<div className="datepicker-wrapper">
					<Controller
						name="dates"
						control={control}
						rules={{ required: true }}
						render={() => (
							<>
								<ReactDatePicker
									className={`input form-control ${errors.dates ? 'input-error' : ''}`}
									dateFormat="dd.MM.yyyy"
									minDate={new Date()}
									shouldCloseOnSelect={true}
									selectsRange={true}
									onChange={onChangeDate}
									startDate={validFrom}
									endDate={validTo}
									withPortal
								/>

								<DatePickerIcon />
							</>
						)}
					/>
				</div>
				{errors.dates && <p className="error-msg">Dates can not be empty</p>}
			</div>

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						handleCloseModal()
					}}
					type={'button'}>
					Cancel
				</Button>
				<Button type="submit">
					{isFormLoading && <Spinner className="form" />}
					{!isFormLoading && (discountToEdit.id ? 'Save changes' : 'Add discount')}
				</Button>
			</div>
		</form>
	)
}

export default DiscountsForm

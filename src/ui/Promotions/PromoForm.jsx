import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { Controller, useForm } from 'react-hook-form'
import FormBox from '../Form/FormBox'
import { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import ReactDatePicker from 'react-datepicker'
import { DatePickerIcon } from '../Icons'
import Button from '../../components/Button'
import { setIsCreating, setIsEditing } from '../../slices/promoSlice'
import toast from 'react-hot-toast'

function PromoForm() {
	const { promoId } = useParams()
	const promotions = data.promotions
	const [validFrom, setValidFrom] = useState(promoId ? promotions.find(promo => promo.id === +promoId).validFrom : null)
	const [validTo, setValidTo] = useState(promoId ? promotions.find(promo => promo.id === +promoId).validTo : null)
	const igloos = data.igloos
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const allIglooOptions = igloos.map(igloo => ({ value: igloo.id, label: igloo.name }))
	const selectedIgloosIds =
		promoId &&
		allIglooOptions.filter(igloo => promotions.find(promo => promo.id === +promoId).iglooId.includes(igloo.value))
	const [iglooOptionsState, setIglooOptionsState] = useState([])

	const onChangeIgloo = igloo => {
		setIglooOptionsState(prevState => [...prevState, igloo])
		setValue('igloos', iglooOptionsState)
	}

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm()

	const onSubmit = data => {
		console.log(data)
		dispatch(setIsCreating(false))
		promoId ? toast.success('Promo edited successfully') : toast.success('Promo added successfully')
		promoId && navigate(-1)
	}

	const getPromoInfo = () => {
		if (promoId) {
			const promo = promotions.find(promo => promo.id === +promoId)
			return promo
		}
	}

	useEffect(() => {
		if (promoId) {
			const promo = getPromoInfo()
			setValue('name', promo.name)
			setValue('discount', parseInt(promo.discount))
			setValue('description', promo.description)
			setValue('igloos', iglooOptionsState)
			setValue('dates', [validFrom, validTo])
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
			<FormBox label="name" error={errors?.name?.message}>
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
			<FormBox label="discount" error={errors?.discount?.message}>
				<input
					type="number"
					id="discount"
					placeholder={promoId ? promotions.find(promo => promo.id === +promoId).discount : 'In %'}
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
					// type="text"
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
				<label className="label">Igloos</label>
				<Controller
					name="igloos"
					control={control}
					rules={{ required: true }}
					render={() => (
						<ReactSelect
							closeMenuOnSelect={false}
							isMulti
							defaultValue={promoId ? selectedIgloosIds : []}
							options={allIglooOptions}
							classNamePrefix="react-select"
							hideSelectedOptions={false}
							onChange={onChangeIgloo}
						/>
					)}
				/>
				{errors.igloos && <p className="error-msg">You must select igloo</p>}
			</div>
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
						dispatch(setIsCreating(false))
						dispatch(setIsEditing(false))
						promoId && navigate(-1)
					}}>
					Cancel
				</Button>
				<Button>{promoId ? 'Edit promotion' : 'Add promotion'}</Button>
			</div>
		</form>
	)
}

export default PromoForm

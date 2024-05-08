import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { Controller, useForm } from 'react-hook-form'
import FormBox from '../Form/FormBox'
import { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import ReactDatePicker from 'react-datepicker'
import { DatePickerIcon } from '../Icons'
import Button from '../Button'
import { setIsCreating, setIsEditing } from '../../slices/promoSlice'

function PromoForm() {
	const { promoId } = useParams()
	const promotions = data.promotions
	const [validFrom, setValidFrom] = useState(promoId ? promotions.find(promo => promo.id === +promoId).validFrom : null)
	const [validTo, setValidTo] = useState(promoId ? promotions.find(promo => promo.id === +promoId).validTo : null)
	const isEditing = useSelector(state => state.promo.isEditing)
	const igloos = data.igloos
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const allIglooOptions = igloos.map(igloo => ({ value: igloo.id, label: igloo.name }))

	// const tempIglooOptions = promoId && promotions.find(promo => promo.id === +promoId).iglooId
	// const iglooOptions = tempIglooOptions?.map(iglooId => {
	// 	const igloo = igloos.find(igloo => igloo.id === iglooId)
	// 	return {
	// 		value: igloo.id,
	// 		label: igloo.name,
	// 	}
	// })
	const [iglooOptionsState, setIglooOptionsState] = useState([])

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors, isValid },
	} = useForm()

	const onSubmit = data => {
		console.log(data)
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
			<FormBox label="discount" error={errors?.discount?.message}>
				<input
					type="number"
					id="discount"
					// placeholder={!isEditing ? '% discount' : promotions.find(promo => promo.id === +promoId).discount}
					// placeholder="$ discount"
					className={`input ${errors.discount ? 'input-error' : ''}`}
					name="discount"
					{...register('discount', { required: 'Discount is required' })}
				/>
			</FormBox>
			<FormBox label="description" error={errors?.description?.message}>
				<input
					type="text"
					id="description"
					className={`input ${errors.description ? 'input-error' : ''}`}
					name="description"
					{...register('description', { required: 'Discount is required' })}
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
							defaultValue={isEditing ? [allIglooOptions[1], allIglooOptions[2], allIglooOptions[3]] : []}
							options={allIglooOptions}
							classNamePrefix="react-select"
						/>
					)}
				/>
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
									// defaultValue={new Date()}
									dateFormat="dd.MM.yyyy"
									minDate={new Date()}
									// placeholderText="Select date"
									shouldCloseOnSelect={true}
									// selected={new Date()}
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
				<Button>{isEditing ? 'Edit booking' : 'Add booking'}</Button>
			</div>
		</form>
	)
}

export default PromoForm

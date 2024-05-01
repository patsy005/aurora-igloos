import ReactDatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import { DatePickerIcon } from '../Icons'
import { useEffect, useState } from 'react'
import Button from '../Button'
import FormBox from '../Form/FormBox'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIgloos } from '../../slices/IglooSlice'

function BookingsForm({setIsCreating}) {
	const igloos = useSelector(state => state.igloos?.igloos)
	const dispatch = useDispatch()
	console.log(igloos)

	useEffect(() => {
		dispatch(fetchIgloos())
	}, [dispatch])
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isValid },
	} = useForm()
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(null)
	const [paymentMethod, setPaymentMethod] = useState('')

	const handlePaymentChange = value => {
		setPaymentMethod(value)
	}

	const onChangeDate = dates => {
		const [start, end] = dates
		setStartDate(start)
		setEndDate(end)
	}

	const onSubmit = data => {
		console.log(data)
        setIsCreating(false)
	}
	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label={'name'} error={errors?.name?.message}>
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
			<div className="form__box col-12 col-sm-5">
				<label className="label">Igloos</label>
				<select className="input igloos-dropdown" {...register('igloo', { required: true })}>
					{igloos.map(igloo => {
						return (
							<option key={igloo.id} value={igloo.name}>
								{igloo.name}
							</option>
						)
					})}
				</select>
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
									startDate={startDate}
									endDate={endDate}
									withPortal
								/>

								<DatePickerIcon />
							</>
						)}
					/>
				</div>
				{errors.dates && <p className="error-msg">Dates can not be empty</p>}
			</div>
			<div className="form__box col-5">
				<p className="label">Method of payment</p>
				<div className="radioGroup">
					<div className="radioBtn">
						<input
							className="radio-input"
							type="radio"
							value="paypalPayment"
							name="paypalPayment"
							{...register('paymentMethod', { required: 'You must select payment method' })}
							checked={paymentMethod === 'paypalPayment'}
							onChange={e => handlePaymentChange(e.target.value)}
						/>
						<label>Paypal</label>
					</div>
					<div className="radioBtn">
						<input
							className="radio-input"
							type="radio"
							value="creditCardPayment"
							name="creditCardPayment"
							{...register('paymentMethod', {
                                required: 'You must select payment method'
                            })}
							checked={paymentMethod === 'creditCardPayment'}
							onChange={e => handlePaymentChange(e.target.value)}
						/>
						<label>Credit Card</label>
					</div>
				</div>
				{errors.paymentMethod && <p className="error-msg">You must select payment method</p>}
			</div>
			<div className="d-flex justify-content-end text-end form-btns">
                <Button  onClick={() => setIsCreating(false)}>Cancel</Button>
				<Button disabled={!isValid}>Add booking</Button>
			</div>
		</form>
	)
}

export default BookingsForm

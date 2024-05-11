import ReactDatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import { DatePickerIcon } from '../Icons'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import FormBox from '../Form/FormBox'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIgloos } from '../../slices/IglooSlice'
import { setIsCreating, setIsEditing } from '../../slices/bookings'
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'

function BookingsForm({}) {
	const igloos = data.igloos
	const isEditing = useSelector(state => state.bookings.isEditing)
	const { bookingId } = useParams()
	const dispatch = useDispatch()
	const bookings = data.bookings
	const customers = data.customers
	const navigate = useNavigate()

	useEffect(() => {
		if (bookingId) {
			dispatch(setIsEditing(true))
		}
	})

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isValid },
	} = useForm()
	const [startDate, setStartDate] = useState(
		bookingId ? bookings.find(booking => booking.id === +bookingId).checkInDate : new Date()
	)
	const [endDate, setEndDate] = useState(
		bookingId ? bookings.find(booking => booking.id === +bookingId).checkOutDate : null
	)
	const [paymentMethod, setPaymentMethod] = useState('')
	const statusArr = ['confirmed', 'unconfirmed', 'checked-in', 'checked-out', 'cancelled']

	const handlePaymentChange = value => {
		setPaymentMethod(value)
	}

	const onChangeDate = dates => {
		const [start, end] = dates
		setStartDate(new Date(start))
		setEndDate(new Date(end))
	}

	const onSubmit = data => {
		console.log(data)
		dispatch(setIsCreating(false))
	}

	const getBookingInfo = () => {
		if (bookingId) {
			const booking = bookings.find(booking => booking.id === +bookingId)
			const customer = customers.find(customer => customer.id === booking.customerId)
			const igloo = igloos.find(igloo => igloo.id === booking.iglooId)
			return { booking, customer, igloo }
		}
	}

	useEffect(() => {
		if (bookingId) {
			const { booking, customer, igloo } = getBookingInfo()
			setValue('name', customer.name)
			setValue('surname', customer.surname)
			setValue('email', customer.email)
			setValue('igloo', igloo.name)
			setValue('dates', [booking.checkInDate, booking.checkOutDate])
			setValue('paymentMethod', booking.paymentMethod)
			setValue('status', booking.status)
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
			<div className="form__box col-12 col-sm-5">
				<label className="label">Igloo</label>
				<Controller
					name="igloo"
					control={control}
					rules={{ required: true }}
					render={() => (
						<select className="input igloos-dropdown" {...register('igloo', { required: true })}>
							{igloos.map(igloo => {
								return (
									<option key={igloo.id} value={igloo.name}>
										{igloo.name}
									</option>
								)
							})}
						</select>
					)}
				/>
				{<p className="error-msg invisible">lll</p>}
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
			{isEditing && (
				<div className="form__box col-12 col-sm-5">
					<label className="label">Booking status</label>
					<select className="input igloos-dropdown" {...register('status', { required: true })}>
						{statusArr.map((status, index) => {
							return (
								<option key={index} value={status}>
									{status}
								</option>
							)
						})}
						{}
					</select>
					{errors.igloo && <p className="error-msg">You must choose igloo</p>}
				</div>
			)}
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
								required: 'You must select payment method',
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
				<Button
					className="cancel-btn"
					onClick={() => {
						dispatch(setIsCreating(false))
						dispatch(setIsEditing(false))
						bookingId && navigate(-1)
					}}>
					Cancel
				</Button>
				<Button>{isEditing ? 'Edit booking' : 'Add booking'}</Button>
			</div>
		</form>
	)
}

export default BookingsForm

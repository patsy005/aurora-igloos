import ReactDatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import { DatePickerIcon } from '../Icons'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import FormBox from '../Form/FormBox'
import { useDispatch } from 'react-redux'
// import { setIsCreating, setIsEditing } from '../../slices/bookingsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import ReactSelect from 'react-select'
import toast from 'react-hot-toast'

function BookingsForm() {
	const igloos = data.igloos
	const { bookingId } = useParams()
	const dispatch = useDispatch()
	const bookings = data.bookings
	const customers = data.customers
	const navigate = useNavigate()

	// useEffect(() => {
	// 	if (bookingId) {
	// 		dispatch(setIsEditing(true))
	// 	}
	// }, [bookingId, setIsEditing])

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: bookingId ? bookings.find(booking => booking.id === +bookingId).name : '',
			surname: bookingId ? bookings.find(booking => booking.id === +bookingId).surname : '',
			email: bookingId ? bookings.find(booking => booking.id === +bookingId).email : '',
			igloo: bookingId ? bookings.find(booking => booking.id === +bookingId).igloo : '',
			dates: bookingId ? [bookings.find(booking => booking.id === +bookingId).dates] : '',
			paymentMethod: bookingId ? bookings.find(booking => booking.id === +bookingId).paymentMethod : '',
			status: bookingId ? bookings.find(booking => booking.id === +bookingId).status : '',
		},
	})

	const [startDate, setStartDate] = useState(
		bookingId ? bookings.find(booking => booking.id === +bookingId).checkInDate : new Date()
	)
	const [endDate, setEndDate] = useState(
		bookingId ? bookings.find(booking => booking.id === +bookingId).checkOutDate : null
	)
	const [paymentMethod, setPaymentMethod] = useState(bookingId ? 'paypalPayment' : '')
	const statusArr = ['confirmed', 'unconfirmed', 'checked-in', 'checked-out', 'cancelled']

	const igloosOptions = igloos.map(igloo => ({ value: igloo.id, label: igloo.name }))
	const statusOptions = statusArr.map(status => ({ value: status, label: status }))
	const selectedIglooId = bookingId ? igloosOptions.find(iglooOp => iglooOp.value === +bookingId) : null
	const [igloo, setIgloo] = useState(bookingId ? igloosOptions.find(igloo => igloo.id === selectedIglooId) : null)

	const handlePaymentChange = value => {
		setPaymentMethod(value)
	}

	const onChangeDate = dates => {
		const [start, end] = dates
		setStartDate(new Date(start))
		setEndDate(new Date(end))
		setValue('dates', [start, end])
	}

	const onIglooChange = igloo => {
		setIgloo(igloo)
		setValue('igloo', igloo)
	}

	const onSubmit = data => {
		console.log(data)
		// dispatch(setIsCreating(false))
		bookingId ? toast.success('Booking edited successfully') : toast.success('Booking added successfully')
		bookingId && navigate(-1)
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
					{...register('name', {
						required: 'Name can not be empty',
						minLength: {
							value: 2,
							message: 'Name must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="surname" error={errors?.surname?.message}>
				<input
					id="surname"
					className={`input ${errors.surname ? 'input-error' : ''}`}
					name="surname"
					{...register('surname', {
						required: 'Surname can not be empty',
						minLength: {
							value: 2,
							message: 'Surname must be at least 2 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="e-mail" error={errors?.email?.message}>
				<input
					id="email"
					className={`input ${errors.email ? 'input-error' : ''}`}
					name="email"
					{...register('email', {
						required: 'Email can not be empty',
						pattern: {
							value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
							message: 'Invalid email address',
						},
					})}
				/>
			</FormBox>
			<div className="form__box col-12 col-sm-5">
				<label className="label">Igloo</label>
				<Controller
					name="igloo"
					control={control}
					rules={{ required: true }}
					render={() => (
						<ReactSelect
							defaultValue={bookingId ? igloo : []}
							options={igloosOptions}
							classNamePrefix="react-select"
							onChange={onIglooChange}
						/>
					)}
				/>
				{errors.igloo && <p className="error-msg">You must select igloo</p>}
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
			{bookingId && (
				<div className="form__box col-12 col-sm-5">
					<label className="label">Booking status</label>
					<ReactSelect defaultValue={statusOptions[1]} options={statusOptions} classNamePrefix="react-select" />
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
						// dispatch(setIsCreating(false))
						// dispatch(setIsEditing(false))
						bookingId && navigate(-1)
					}}>
					Cancel
				</Button>
				<Button>{bookingId ? 'Edit booking' : 'Add booking'}</Button>
			</div>
		</form>
	)
}

export default BookingsForm

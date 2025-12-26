import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import { findExistingCustomerByEmail, formatDateOnly, isBetweenDates, parseDateOnly } from '../../utils/utils'
import { addNewCustomer, fetchCustomers } from '../../slices/customersSLice'
import { addNewBooking, editBooking, fetchBookings } from '../../slices/bookingsSlice'
import toast from 'react-hot-toast'
import FormBox from '../../ui/Form/FormBox'
import SelectComponent from '../../components/select/SelectComponent'
import ReactDatePicker from 'react-datepicker'
import { DatePickerIcon } from '../../ui/Icons'
import Button from '../../components/Button'

function BookingsForm() {
	const bookings = useSelector(state => state.bookings.bookings)
	const customers = useSelector(state => state.customers.customers)
	const igloos = useSelector(state => state.igloos.igloos)
	const trips = useSelector(state => state.trips.trips)
	const paymentMethods = useSelector(state => state.paymentMethods.paymentMethods)

	const { closeModal, props } = useModal()
	const bookingToEdit = props

	const [checkIn, setCheckIn] = useState(
		bookingToEdit?.id ? parseDateOnly(bookings.find(booking => booking.id === +bookingToEdit.id).checkIn) : null
	)
	const [checkOut, setCheckOut] = useState(
		bookingToEdit?.id ? parseDateOnly(bookings.find(booking => booking.id === +bookingToEdit.id).checkOut) : null
	)

	const [tripDate, setTripDate] = useState(
		bookingToEdit?.id ? parseDateOnly(bookings.find(booking => booking.id === +bookingToEdit.id).tripDate) : null
	)

	const dispatch = useDispatch()

	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		formState: { errors, isLoading: isFormLoading },
	} = useForm({
		defaultValues: {
			bookingType: 'igloo',
			// customer
			idCustomer: null,
			customerName: '',
			customerSurname: '',
			customerEmail: '',
			customerPhone: '',
			street: '',
			streetNumber: '',
			houseNumber: '',
			city: '',
			postalCode: '',
			country: '',
			// booking
			idIgloo: null,
			tripId: null,
			paymentMethodId: null,
			checkIn: '',
			checkOut: '',
			earlyCheckInRequest: false,
			lateCheckOutRequest: false,
			guests: 1,
			tripDate: null,
		},
	})

	const handleCloseModal = () => closeModal()

	const customerEmail = watch('customerEmail')

	const bookingType = watch('bookingType')
	const showIgloo = bookingType === 'igloo' || bookingType === 'both'
	const showTrip = bookingType === 'trip' || bookingType === 'both'

	useEffect(() => {
		if (bookingToEdit?.id) return

		if (!showIgloo) {
			setValue('idIgloo', null)
			setCheckIn(null)
			setCheckOut(null)
			setValue('checkIn', null)
			setValue('checkOut', null)
		}

		if (!showTrip) {
			setValue('tripId', null)
			setTripDate(null)
			setValue('tripDate', null)
		}
	}, [showIgloo, showTrip, setValue, bookingToEdit])

	const existingCustomer = useMemo(() => {
		if (!customers.length) return null
		return findExistingCustomerByEmail(customers, customerEmail)
	}, [customers, customerEmail])

	const iglooOptions = useMemo(
		() => [{ value: '', label: 'Select igloo' }, ...igloos.map(igloo => ({ value: igloo.id, label: igloo.name }))],
		[igloos]
	)

	const tripOptions = useMemo(
		() => [{ value: '', label: 'Select trip' }, ...trips.map(trip => ({ value: trip.id, label: trip.name }))],
		[trips]
	)

	const paymentMethodsOptions = useMemo(
		() => [
			{ value: '', label: 'Select payment method' },
			...paymentMethods.map(method => ({ value: method.id, label: method.name })),
		],
		[paymentMethods]
	)

	useEffect(() => {
		if (existingCustomer) {
			setValue('idCustomer', existingCustomer.id)
			setValue('customerName', existingCustomer.name)
			setValue('customerSurname', existingCustomer.surname)
			setValue('street', existingCustomer.street)
			setValue('streetNumber', existingCustomer.streetNumber)
			setValue('houseNumber', existingCustomer.houseNumber)
			setValue('city', existingCustomer.city)
			setValue('postalCode', existingCustomer.postalCode)
			setValue('country', existingCustomer.country)
			setValue('customerEmail', existingCustomer.email)
			setValue('customerPhone', existingCustomer.phone)
		} else {
			setValue('idCustomer', null)
		}
	}, [existingCustomer, setValue])

	const isExistingCustomer = !!watch('idCustomer')

	const onSubmit = async data => {
		let customerId = data.idCustomer

		// create new customer if not existing
		if (!isExistingCustomer) {
			const newCustomer = {
				name: data.customerName,
				surname: data.customerSurname,
				email: data.customerEmail,
				phone: data.customerPhone,
				street: data.street,
				streetNumber: data.streetNumber,
				houseNumber: data.houseNumber,
				city: data.city,
				postalCode: data.postalCode,
				country: data.country,
				createUser: false,
			}

			const newlyCreatedCustomer = await dispatch(addNewCustomer(newCustomer))
				.unwrap()
				.then(() => dispatch(fetchCustomers()))
			customerId = newlyCreatedCustomer.id
		}

		// create booking
		const newBooking = {
			idCustomer: +customerId,
			idIgloo: data.idIgloo,
			tripId: data.tripId,
			paymentMethodId: data.paymentMethodId,
			checkIn: formatDateOnly(checkIn),
			checkOut: formatDateOnly(checkOut),
			earlyCheckInRequest: !!data.earlyCheckInRequest,
			lateCheckOutRequest: !!data.lateCheckOutRequest,
			guests: data.guests,
			tripDate: formatDateOnly(tripDate),
		}

		if (bookingToEdit.id) {
			dispatch(editBooking({ id: bookingToEdit.id, updatedBooking: { ...newBooking, id: bookingToEdit.id } }))
				.unwrap()
				.then(() => {
					toast.success('Booking edited successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchBookings()))
				.catch(() => {
					toast.error('Failed to edit booking')
				})
		} else {
			dispatch(addNewBooking(newBooking))
				.unwrap()
				.then(() => {
					toast.success('Booking added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchBookings()))
				.catch(() => {
					toast.error('Failed to add booking')
				})
		}
	}

	const getBookingInfo = () => {
		if (bookingToEdit.id) {
			const booking = bookings.find(booking => booking.id === +bookingToEdit.id)
			return booking
		}
	}

	useEffect(() => {
		if (!bookingToEdit.id) return

		const booking = getBookingInfo()
		if (!booking) return

		const hasIgloo = !!booking.idIgloo
		const hasTrip = !!booking.tripId

		const type = hasIgloo && hasTrip ? 'both' : hasIgloo ? 'igloo' : 'trip'

		setValue('idIgloo', booking.idIgloo)
		setValue('tripId', booking.tripId)
		setValue('paymentMethodId', booking.paymentMethodId)
		setValue('checkIn', parseDateOnly(booking.checkIn))
		setValue('checkOut', parseDateOnly(booking.checkOut))
		setValue('earlyCheckInRequest', !!booking.earlyCheckInRequest)
		setValue('lateCheckOutRequest', !!booking.lateCheckOutRequest)
		setValue('guests', booking.guests)
		setValue('tripDate', parseDateOnly(booking.tripDate))

		setValue('bookingType', type)

		setValue('idCustomer', booking.idCustomer)

		const customer = customers.find(cust => cust.id === booking.idCustomer)
		if (customer) {
			setValue('customerName', customer.name)
			setValue('customerSurname', customer.surname)
			setValue('customerEmail', customer.email)
			setValue('customerPhone', customer.phone)
			setValue('street', customer.street)
			setValue('streetNumber', customer.streetNumber)
			setValue('houseNumber', customer.houseNumber)
			setValue('city', customer.city)
			setValue('postalCode', customer.postalCode)
			setValue('country', customer.country)
		} else {
			setValue('customerName', booking.customerName ?? '')
			setValue('customerSurname', booking.customerSurname ?? '')
			setValue('customerEmail', booking.customerEmail ?? '')
			setValue('customerPhone', booking.customerPhone ?? '')
		}
	}, [bookingToEdit, setValue, bookings, customers])

	const onCheckInDateChange = date => {
		setCheckIn(date)
		setValue('checkIn', date)
	}

	const onCheckOutDateChange = date => {
		setCheckOut(date)
		setValue('checkOut', date)
	}

	const onTripDateChange = date => {
		setTripDate(date)
		setValue('tripDate', date)
	}

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h2>Check for existing customer</h2>
			<FormBox label="customer email" error={errors?.customerEmail?.message} className="mt-4">
				<input
					id="customerEmail"
					className={`input ${errors.customerEmail ? 'input-error' : ''}`}
					{...register('customerEmail', {
						required: 'Email is required',
						pattern: {
							value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
							message: 'Invalid email address',
						},
					})}
				/>
			</FormBox>

			<div className="form__box col-12 col-sm-5 mt-4">
				<p className="label">Booking type</p>
				<div className="radioGroup flex-row">
					<div className="radioBtn">
						<input
							className="ratio-input"
							type="radio"
							value="igloo"
							{...register('bookingType', { required: 'Choose booking type' })}
							// checked={bookingType === 'igloo'}
							// onChange={e => handlePaymentChange(e.target.value)}
						/>
						<label>Igloo</label>
					</div>
					<div className="radioBtn">
						<input
							className="ratio-input"
							type="radio"
							value="trip"
							{...register('bookingType', {
								required: 'Choose booking type',
							})}
							// checked={paymentMethod === 'creditCardPayment'}
							// onChange={e => handlePaymentChange(e.target.value)}
						/>
						<label>Trip</label>
					</div>
					<div className="radioBtn">
						<input
							className="ratio-input"
							type="radio"
							value="both"
							{...register('bookingType', {
								required: 'Choose booking type',
							})}
							// checked={paymentMethod === 'creditCardPayment'}
							// onChange={e => handlePaymentChange(e.target.value)}
						/>
						<label>Both</label>
					</div>
				</div>
				{errors.bookingType && <p className="error-message mt-1">{errors.bookingType.message}</p>}
			</div>

			{isExistingCustomer && (
				<div className="col-12">
					<p className="mt-2" style={{ opacity: 0.8 }}>
						Found existing customer:{' '}
						<strong>
							{watch('customerName')} {watch('customerSurname')}
						</strong>
					</p>
				</div>
			)}

			{!existingCustomer && (
				<>
					<FormBox label="name" error={errors?.customerName?.message} className="mt-4">
						<input
							id="customerName"
							className={`input ${errors.customerName ? 'input-error' : ''}`}
							{...register('customerName', { required: 'Name is required' })}
							disabled={isExistingCustomer}
						/>
					</FormBox>

					<FormBox label="surname" error={errors?.customerSurname?.message} className="mt-4">
						<input
							id="customerSurname"
							className={`input ${errors.customerSurname ? 'input-error' : ''}`}
							{...register('customerSurname', { required: 'Surname is required' })}
							disabled={isExistingCustomer}
						/>
					</FormBox>

					<FormBox label="customerPhone" error={errors?.customerPhone?.message} className="mt-4">
						<input
							id="customerPhone"
							className={`input ${errors.customerPhone ? 'input-error' : ''}`}
							name="customerPhone"
							{...register('customerPhone', {
								required: 'Phone number can not be empty',
								pattern: {
									value: /^\+?[1-9]\d{1,14}$/,
									message: 'Invalid phone number',
								},
							})}
						/>
					</FormBox>

					<FormBox label="street" error={errors?.street?.message} className="mt-4">
						<input
							id="street"
							className={`input ${errors.street ? 'input-error' : ''}`}
							{...register('street', {
								required: 'Street can not be empty',
								pattern: {
									value: /^[\p{L}\s.'-]+$/u,
									message: 'Street name can contain only letters and spaces',
								},
							})}
						/>
					</FormBox>
					<FormBox label="streetNumber" error={errors?.streetNumber?.message} className="mt-4">
						<input
							id="streetNumber"
							className={`input ${errors.streetNumber ? 'input-error' : ''}`}
							name="streetNumber"
							{...register('streetNumber', {
								required: 'streetNumber can not be empty',
								pattern: {
									value: /^\d+[A-Za-z]?$/,
									message: 'Use format 12 or 12A',
								},
							})}
						/>
					</FormBox>
					<FormBox label="houseNumber" error={errors?.houseNumber?.message} className="mt-4">
						<input
							id="houseNumber"
							className={`input ${errors.street ? 'input-error' : ''}`}
							name="houseNumber"
							{...register('houseNumber', {
								required: false,
								pattern: {
									value: /^\d+([A-Za-z]?)(\/\d+[A-Za-z]?)?$/,
									message: 'Use format 12, 12A, 12/3 or 12A/3B',
								},
							})}
						/>
					</FormBox>
					<FormBox label="city" error={errors?.city?.message} className="mt-4">
						<input
							id="city"
							className={`input ${errors.city ? 'input-error' : ''}`}
							name="city"
							{...register('city', {
								required: 'City can not be empty',
								minLength: {
									value: 2,
									message: 'City must be at least 2 characters long',
								},
								pattern: {
									value: /^[\p{L}\s-]+$/u,
									message: 'City must contain only letters',
								},
							})}
						/>
					</FormBox>
					<FormBox label="postalCode" error={errors?.postalCode?.message} className="mt-4">
						<input
							id="postalCode"
							className={`input ${errors.postalCode ? 'input-error' : ''}`}
							name="postalCode"
							{...register('postalCode', {
								required: 'Postal code can not be empty',
								pattern: {
									value: /^[\p{L}0-9\s-]+$/u,
									message: 'Invalid postal code format',
								},
							})}
						/>
					</FormBox>
					<FormBox label="country" error={errors?.country?.message} className="mt-4">
						<input
							id="country"
							className={`input ${errors.country ? 'input-error' : ''}`}
							name="country"
							{...register('country', {
								required: 'Country can not be empty',
								minLength: {
									value: 2,
									message: 'Country must be at least 2 characters long',
								},
							})}
						/>
					</FormBox>
				</>
			)}

			{showIgloo && (
				<FormBox label="Igloo" error={errors?.idIgloo?.message} className="mt-4">
					<Controller
						name="idIgloo"
						control={control}
						rules={{ required: false }}
						render={({ field: { onChange, value } }) => (
							<SelectComponent
								id="idIgloo"
								className={`react-select ${errors.idIgloo ? 'input-error' : ''}`}
								classNamePrefix="react-select"
								name="idIgloo"
								options={iglooOptions}
								value={iglooOptions.find(option => option.value === value) ?? iglooOptions[0]}
								placeholder="Select igloo"
								onChangeFn={onChange}
							/>
						)}
					/>
				</FormBox>
			)}

			{showTrip && (
				<FormBox label="Trip" error={errors?.tripId?.message} className="mt-4">
					<Controller
						name="tripId"
						control={control}
						rules={{ required: false }}
						render={({ field: { onChange, value } }) => (
							<SelectComponent
								id="tripId"
								className={`react-select ${errors.tripId ? 'input-error' : ''}`}
								classNamePrefix="react-select"
								name="tripId"
								options={tripOptions}
								value={tripOptions.find(option => option.value === value) ?? tripOptions[0]}
								placeholder="Select trip"
								onChangeFn={onChange}
							/>
						)}
					/>
				</FormBox>
			)}

			<FormBox label="Payment method" error={errors?.paymentMethodId?.message} className="mt-4">
				<Controller
					name="paymentMethodId"
					control={control}
					rules={{ required: false }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="paymentMethodId"
							className={`react-select ${errors.paymentMethodId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="paymentMethodId"
							options={paymentMethodsOptions}
							value={paymentMethodsOptions.find(option => option.value === value) ?? paymentMethodsOptions[0]}
							placeholder="Select trip"
							onChangeFn={onChange}
						/>
					)}
				/>
			</FormBox>

			<div>
				<FormBox label="guests" error={errors?.guests?.message} className="mt-4">
					<input
						type="number"
						id="guests"
						className={`input ${errors.guests ? 'input-error' : ''}`}
						{...register('guests', { min: { value: 1, message: 'Min 1 guest' } })}
					/>
				</FormBox>
			</div>

			{showIgloo && (
				<>
					<FormBox label="early check-in request" error={errors?.earlyCheckInRequest?.message} className="mt-4">
						<input
							id="earlyCheckInRequest"
							type="checkbox"
							className="checkbox-input"
							{...register('earlyCheckInRequest')}
						/>
						{/* <input
							className="radio-input"
							type="radio"
							value="igloo"
							{...register('bookingType', { required: 'Choose booking type' })}
							// checked={bookingType === 'igloo'}
							// onChange={e => handlePaymentChange(e.target.value)}
						/> */}
					</FormBox>
					<FormBox label="late check-out request" error={errors?.lateCheckOutRequest?.message} className="mt-4">
						<input
							id="lateCheckOutRequest"
							type="checkbox"
							className="checkbox-input"
							{...register('lateCheckOutRequest')}
						/>
					</FormBox>

					<FormBox label="Check in" error={errors?.checkIn?.message} className="mt-4">
						<div className="datepicker-wrapper">
							<Controller
								name="checkIn"
								control={control}
								rules={{ required: true }}
								render={() => (
									<>
										<ReactDatePicker
											className={`input form-control ${errors.dates ? 'input-error' : ''}`}
											dateFormat="dd.MM.yyyy"
											minDate={new Date()}
											shouldCloseOnSelect={true}
											// selectsRange={false}
											onChange={onCheckInDateChange}
											// startDate={validFrom}
											// endDate={validTo}
											selected={checkIn}
											withPortal
										/>

										<DatePickerIcon />
									</>
								)}
							/>
						</div>
					</FormBox>

					<FormBox label="Check out" error={errors?.checkOut?.message} className="mt-4">
						<div className="datepicker-wrapper">
							<Controller
								name="checkOut"
								control={control}
								rules={{ required: true }}
								render={() => (
									<>
										<ReactDatePicker
											className={`input form-control ${errors.dates ? 'input-error' : ''}`}
											dateFormat="dd.MM.yyyy"
											minDate={new Date()}
											shouldCloseOnSelect={true}
											// selectsRange={false}
											onChange={onCheckOutDateChange}
											// startDate={validFrom}
											// endDate={validTo}
											selected={checkOut}
											withPortal
										/>

										<DatePickerIcon />
									</>
								)}
							/>
						</div>
					</FormBox>
				</>
			)}

			{showTrip && (
				<FormBox label="Trip date" error={errors?.tripDate?.message} className="mt-4">
					<div className="datepicker-wrapper">
						<Controller
							name="tripDate"
							control={control}
							rules={{
								required: true,
								validate: value =>
									isBetweenDates(value, checkIn, checkOut) || 'Trip date must be between check-in and check-out dates',
							}}
							render={() => (
								<>
									<ReactDatePicker
										className={`input form-control ${errors.dates ? 'input-error' : ''}`}
										dateFormat="dd.MM.yyyy"
										minDate={new Date()}
										shouldCloseOnSelect={true}
										// selectsRange={false}
										onChange={onTripDateChange}
										// startDate={validFrom}
										// endDate={validTo}
										selected={tripDate}
										withPortal
									/>

									<DatePickerIcon />
								</>
							)}
						/>
					</div>
				</FormBox>
			)}

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						handleCloseModal()
					}}
					type={'button'}>
					Cancel
				</Button>
				<Button type="submit">{bookingToEdit.id ? 'Edit booking' : 'Add booking'}</Button>
			</div>
		</form>
	)
}

export default BookingsForm

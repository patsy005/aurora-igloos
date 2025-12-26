import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/modalContext'
import { Controller, useForm } from 'react-hook-form'
import { addNewTrip, editTrip, fetchTrips } from '../../slices/tripsSlice'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import FormBox from '../../ui/Form/FormBox'
import SelectComponent from '../../components/select/SelectComponent'
import Button from '../../components/Button'

function TripsForm() {
	const trips = useSelector(state => state.trips.trips)
	const employees = useSelector(state => state.employees.employees)
	const tripSeasons = useSelector(state => state.tripSeasons.tripSeasons)
	const tripLevels = useSelector(state => state.tripLevels.tripLevels)

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { closeModal, props } = useModal()
	const tripToEdit = props

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isLoading: isFormLoading },
	} = useForm({
		defaultValues: {
			name: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).name : '',
			duration: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).duration : '',
			shortDescription: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).shortDescription : '',
			longDescription: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).longDescription : '',
			levelOfDifficultyId: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).levelOfDifficultyId : '',
			seasonId: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).seasonId : '',
			guideId: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).guideId : '',
			pricePerPerson: tripToEdit.id ? trips.find(trip => trip.id === +tripToEdit.id).pricePerPerson : '',
		},
	})

	const levelsOfDifficultyOptions = [
		{ value: '', label: 'Select level of difficulty' },
		...tripLevels.map(level => ({
			value: level.id,
			label: level.name,
		})),
	]

	const tripSeasonsOptions = [
		{ value: '', label: 'Select trip season' },
		...tripSeasons.map(season => ({
			value: season.id,
			label: season.name,
		})),
	]

	console.log('employees', employees)
	const guidesOptions = [
		{ value: '', label: 'Select guide' },
		...employees
			.filter(employee => employee.role == 'Guide')
			.map(guide => ({
				value: guide.id,
				label: `${guide.name} ${guide.surname}`,
			})),
	]

	const handleCloseModal = () => closeModal()

	const onSubmit = data => {
		// const newTrip = {
		// 	name: data.name,
		// 	duration: data.duration,
		// 	shortDescription: data.shortDescription,
		// 	longDescription: data.longDescription,
		// 	levelOfDifficultyId: +data.levelOfDifficultyId,
		// 	seasonId: +data.seasonId,
		// 	guideId: +data.guideId,
		// 	pricePerPerson: +data.pricePerPerson,
		// }

		const formData = new FormData()

		formData.append('Name', data.name)
		formData.append('Duration', data.duration)
		formData.append('ShortDescription', data.shortDescription)
		formData.append('LongDescription', data.longDescription)

		formData.append('PricePerPerson', data.pricePerPerson)

		if (data.seasonId) formData.append('SeasonId', data.seasonId)
		if (data.levelOfDifficultyId) formData.append('LevelOfDifficultyId', data.levelOfDifficultyId)
		if (data.guideId) formData.append('GuideId', data.guideId)

		if (data.img && data.img.length > 0) formData.append('PhotoFile', data.img[0])

		if (tripToEdit.id) {
			formData.append('Id', tripToEdit.id)
			// Edit existing trip
			dispatch(editTrip({ id: tripToEdit.id, updatedTrip: formData }))
				.unwrap()
				.then(() => {
					toast.success('Trip updated successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchTrips()))
				.catch(() => {
					toast.error('Error updating trip')
				})
		} else {
			// Add new trip
			dispatch(addNewTrip(formData))
				.unwrap()
				.then(() => {
					toast.success('Trip added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchTrips()))
				.catch(() => {
					toast.error('Error adding trip')
				})
		}
	}

	const getTripInfo = () => {
		if (tripToEdit.id) {
			const trip = trips.find(trip => trip.id === +tripToEdit.id)
			return trip
		}
	}

	useEffect(() => {
		if (tripToEdit.id) {
			const trip = getTripInfo()

			setValue('name', trip.name)
			setValue('duration', trip.duration)
			setValue('shortDescription', trip.shortDescription)
			setValue('longDescription', trip.longDescription)
			setValue('levelOfDifficultyId', trip.levelOfDifficultyId)
			setValue('seasonId', trip.seasonId)
			setValue('guideId', trip.guideId)
			setValue('pricePerPerson', trip.pricePerPerson)
		}
	}, [tripToEdit, setValue])

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message} className="mt-4">
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
			<FormBox label="duration" error={errors?.duration?.message} className="mt-4">
				<input
					type="number"
					id="duration"
					className={`input ${errors.duration ? 'input-error' : ''}`}
					name="duration"
					{...register('duration', {
						required: 'Duration is required',
						min: {
							value: 1,
							message: 'Duration must be at least 1 day',
						},
					})}
				/>
			</FormBox>
			<FormBox label="short description" error={errors?.shortDescription?.message} className="mt-4">
				<textarea
					id="shortDescription"
					className={`input ${errors.shortDescription ? 'input-error' : ''}`}
					name="shortDescription"
					{...register('shortDescription', {
						required: 'Short description is required',
						minLength: {
							value: 10,
							message: 'Short description must be at least 10 characters long',
						},
						maxLength: {
							value: 200,
							message: 'Short description can be at most 200 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="long description" error={errors?.longDescription?.message} className="mt-4">
				<textarea
					id="longDescription"
					className={`input ${errors.longDescription ? 'input-error' : ''}`}
					name="longDescription"
					{...register('longDescription', {
						required: 'Long description is required',
						minLength: {
							value: 20,
							message: 'Long description must be at least 20 characters long',
						},
						maxLength: {
							value: 1000,
							message: 'Long description can be at most 1000 characters long',
						},
					})}
				/>
			</FormBox>
			<FormBox label="price per person" error={errors?.pricePerPerson?.message} className="mt-4">
				<input
					type="number"
					id="pricePerPerson"
					className={`input ${errors.pricePerPerson ? 'input-error' : ''}`}
					name="pricePerPerson"
					{...register('pricePerPerson', {
						required: 'Price per person is required',
						min: {
							value: 0,
							message: 'Price per person must be at least 0',
						},
					})}
				/>
			</FormBox>

			<FormBox label="Season" error={errors?.seasonId?.message} className="mt-4">
				<Controller
					name="seasonId"
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="seasonId"
							className={`react-select ${errors.seasonId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="seasonId"
							options={tripSeasonsOptions}
							value={tripSeasonsOptions.find(option => option.value === value) ?? tripSeasonsOptions[0]}
							placeholder="Select season"
							onChangeFn={onChange}
						/>
					)}
				/>
			</FormBox>
			<FormBox label="Level of difficulty" error={errors?.levelOfDifficultyId?.message} className="mt-4">
				<Controller
					name="levelOfDifficultyId"
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="levelOfDifficultyId"
							className={`react-select ${errors.levelOfDifficultyId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="levelOfDifficultyId"
							options={levelsOfDifficultyOptions}
							value={levelsOfDifficultyOptions.find(option => option.value === value) ?? levelsOfDifficultyOptions[0]}
							placeholder="Select season"
							onChangeFn={onChange}
						/>
					)}
				/>
			</FormBox>
			<FormBox label="Guide" error={errors?.guideId?.message} className="mt-4">
				<Controller
					name="guideId"
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="guideId"
							className={`react-select ${errors.guideId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="guideId"
							options={guidesOptions}
							value={guidesOptions.find(option => option.value === value) ?? guidesOptions[0]}
							placeholder="Select season"
							onChangeFn={onChange}
						/>
					)}
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

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						handleCloseModal()
					}}
					type={'button'}>
					Cancel
				</Button>
				<Button type={'submit'}>{tripToEdit.id ? 'Edit trip' : 'Add trip'}</Button>
			</div>
		</form>
	)
}

export default TripsForm

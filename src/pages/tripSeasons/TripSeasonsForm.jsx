import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { addNewTripSeason, editTripSeason, fetchTripSeasons } from '../../slices/tripSeasonSlice'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import FormBox from '../../components/Form/FormBox'
import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'

function TripSeasonsForm() {
	const tripSeasons = useSelector(state => state.tripSeasons.tripSeasons)
	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const tripSeasonToEdit = props

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			name: tripSeasonToEdit.id ? tripSeasons.find(season => season.id === +tripSeasonToEdit.id).name : '',
			description: tripSeasonToEdit.id
				? tripSeasons.find(season => season.id === +tripSeasonToEdit.id).description
				: '',
		},
	})

	const handleCloseModal = () => closeModal()

	const onSubmit = data => {
		const newTripSeason = {
			name: data.name,
			description: data.description,
		}

		if (tripSeasonToEdit.id) {
			dispatch(editTripSeason({ id: tripSeasonToEdit.id, updatedTripSeason: newTripSeason }))
				.unwrap()
				.then(() => {
					toast.success('Trip season edited successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchTripSeasons()))
				.catch(err => {
					console.error('Failed to edit trip season: ', err)
				})
		} else {
			dispatch(addNewTripSeason(newTripSeason))
				.unwrap()
				.then(() => {
					toast.success('Trip season added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchTripSeasons()))
				.catch(err => {
					console.error('Failed to add trip season: ', err)
				})
		}
	}

	const getTripSeasonById = () => {
		if (tripSeasonToEdit.id) {
			const trip = tripSeasons.find(season => season.id === +tripSeasonToEdit.id)
			return trip
		}
	}

	useEffect(() => {
		if (tripSeasonToEdit.id) {
			const tripSeason = getTripSeasonById(tripSeasonToEdit.id)
			setValue('name', tripSeason.name)
			setValue('description', tripSeason.description)
		}
	}, [tripSeasonToEdit, setValue])

	return (
		<form className="form mt-5 row flex-column" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="name" error={errors?.name?.message} className="mt-4 w-100">
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
			<FormBox label="short description" error={errors?.description?.message} className="mt-4 w-100">
				<textarea
					id="description"
					className={`input ${errors.description ? 'input-error' : ''}`}
					name="description"
					{...register('description', {
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

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						handleCloseModal()
					}}
					type={'button'}>
					Cancel
				</Button>
				<Button type={'submit'}>
					{isFormLoading && <Spinner className="form" />}
					{!isFormLoading && (tripSeasonToEdit.id ? 'Save changes' : 'Add trip season')}
				</Button>
			</div>
		</form>
	)
}

export default TripSeasonsForm

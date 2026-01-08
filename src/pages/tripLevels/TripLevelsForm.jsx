import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { addNewTripLevel, editTripLevel, fetchTripLevel } from '../../slices/tripLevelSlice'
import toast from 'react-hot-toast'
import { useEffect, useMemo } from 'react'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import FormBox from '../../components/Form/FormBox'
import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'

function TripLevelsForm() {
	const tripLevels = useSelector(state => state.tripLevels.tripLevels)
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])
	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const tripLevelToEdit = props

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			name: tripLevelToEdit.id ? tripLevels.find(level => level.id === +tripLevelToEdit.id).name : '',
			description: tripLevelToEdit.id ? tripLevels.find(level => level.id === +tripLevelToEdit.id).description : '',
			level: tripLevelToEdit.id ? tripLevels.find(level => level.id === +tripLevelToEdit.id).level : '',
		},
	})

	const handleCloseModal = () => closeModal()

	const onSubmit = data => {
		const newTripLevel = {
			name: data.name,
			description: data.description,
			level: data.level,
		}

		if (tripLevelToEdit.id) {
			dispatch(editTripLevel({ id: tripLevelToEdit.id, updatedTripLevel: { id: tripLevelToEdit.id, ...newTripLevel } }))
				.unwrap()
				.then(() => {
					toast.success('Trip level edited successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchTripLevel()))
				.catch(err => {
					console.error('Failed to edit trip level: ', err)
				})
		} else {
			dispatch(addNewTripLevel(newTripLevel))
				.unwrap()
				.then(() => {
					toast.success('Trip level added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchTripLevel()))
				.catch(err => {
					console.error('Failed to add trip level: ', err)
				})
		}
	}

	const getTripLevelById = () => {
		if (tripLevelToEdit.id) {
			const trip = tripLevels.find(level => level.id === +tripLevelToEdit.id)
			return trip
		}
	}

	useEffect(() => {
		if (tripLevelToEdit.id) {
			const tripLevel = getTripLevelById()
			setValue('name', tripLevel.name)
			setValue('description', tripLevel.description)
			setValue('level', tripLevel.level)
		}
	}, [tripLevelToEdit, setValue])

	return (
		<form className="form mt-5 row flex-column" onSubmit={handleSubmit(onSubmit)}>
			<FormBox
				label={getContentFromMap(contentMap, 'common.name', 'name')}
				error={errors?.name?.message}
				className="mt-4 w-100">
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

			<FormBox
				label={getContentFromMap(contentMap, 'common.shortDescription', 'short description')}
				error={errors?.description?.message}
				className="mt-4 w-100">
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

			<FormBox
				label={getContentFromMap(contentMap, 'tripLevels.label.levelCode', 'Level Code')}
				error={errors?.level?.message}
				className="mt-4 w-100">
				<input
					id="level"
					className={`input ${errors.level ? 'input-error' : ''}`}
					name="level"
					{...register('level', {
						required: 'Level code is required',
						minLength: {
							value: 1,
							message: 'Level code must be at least 1 character long',
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
					{getContentFromMap(contentMap, 'form.cancelBtn', 'Cancel')}
				</Button>
				<Button type={'submit'}>
					{isFormLoading && <Spinner className="form" />}
					{!isFormLoading &&
						(tripLevelToEdit.id
							? getContentFromMap(contentMap, 'form.saveChanges', 'Save changes')
							: getContentFromMap(contentMap, 'tripLevels.cta', 'Add trip level'))}
				</Button>
			</div>
		</form>
	)
}

export default TripLevelsForm

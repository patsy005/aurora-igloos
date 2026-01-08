import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { addNewContentBlock, editContentBlock, fetchContentBlocks } from '../../slices/contentBlocksSlice'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import toast from 'react-hot-toast'
import FormBox from '../../components/Form/FormBox'
import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'

function ContentsForm() {
	const contents = useSelector(state => state.contentBlocks.items)
	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const contentToEdit = props
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const selectedContent = useMemo(() => {
		if (!contentToEdit?.id) return null
		return contents.find(c => c.id === +contentToEdit.id)
	}, [contentToEdit, contents])

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			key: selectedContent ? selectedContent.key : '',
			value: selectedContent ? selectedContent.value : '',
		},
	})

	const handleCloseModal = () => closeModal()

	useEffect(() => {
		if (!selectedContent) return
		setValue('key', selectedContent.key)
		setValue('value', selectedContent.value)
	}, [selectedContent, setValue])

	const onSubmit = async data => {
		const newContentBlock = {
			key: data.key,
			value: data.value,
		}

		if (selectedContent) {
			// Dispatch edit action
			await dispatch(
				editContentBlock({
					id: selectedContent.id,
					updatedContentBlock: { id: selectedContent.id, ...newContentBlock },
				})
			)
				.unwrap()
				.then(() => {
					toast.success('Content updated successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchContentBlocks()))
				.catch(() => {
					toast.error('Failed to update content')
				})
		} else {
			// Dispatch add action
			await dispatch(addNewContentBlock(newContentBlock))
				.unwrap()
				.then(() => {
					toast.success('Content added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchContentBlocks()))
				.catch(() => {
					toast.error('Failed to add content')
				})
		}
	}
	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label={getContentFromMap(contentMap, 'content.form.label.key', 'Content Key')} error={errors?.key?.message}>
				<input
					id="key"
					className={`input ${errors.key ? 'input-error' : ''}`}
					name="key"
					{...register('key', {
						required: 'Name can not be empty',
						minLength: { value: 2, message: 'Name must be at least 2 characters long' },
					})}
				/>
			</FormBox>

			<FormBox label={getContentFromMap(contentMap, 'content.form.label.value', 'Content Value')} error={errors?.value?.message}>
				<input
					id="value"
					className={`input ${errors.value ? 'input-error' : ''}`}
					name="value"
					{...register('value', {
						required: 'Name can not be empty',
						minLength: { value: 1, message: 'Name must be at least 1 character long' },
					})}
				/>
			</FormBox>

			<div className="d-flex justify-content-end text-end form-btns">
				<Button className="cancel-btn" onClick={handleCloseModal} type={'button'}>
					{getContentFromMap(contentMap, 'form.cancelBtn', 'Cancel')}
				</Button>

				<Button type={'submit'}>
					{isSubmitting && <Spinner className="form" />}
					{!isSubmitting && (selectedContent?.id ? getContentFromMap(contentMap, 'form.saveChanges', 'Save changes') : getContentFromMap(contentMap, 'content.form.addBtn', 'Add content'))}
				</Button>
			</div>
		</form>
	)
}

export default ContentsForm

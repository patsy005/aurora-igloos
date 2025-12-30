import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { addNewForumCategory, editForumCategory, fetchForumCategories } from '../../../slices/forumCategorySlice'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import FormBox from '../../../ui/Form/FormBox'

function ForumCategoriesForm() {
	const forumCategories = useSelector(state => state.forumCategories.forumCategories)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { closeModal, props } = useModal()
	const categoryToEdit = props

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
		},
	})

	const handleCloseModal = () => closeModal()

	const onSubmit = data => {
		const newCategory = {
			name: data.name,
		}

		if (categoryToEdit.id) {
			dispatch(
				editForumCategory({ id: +categoryToEdit.id, updatedForumCategory: { ...newCategory, id: categoryToEdit.id } })
			)
				.unwrap()
				.then(() => {
					toast.success('Forum category updated successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchForumCategories()))
				.catch(() => {
					toast.error('Error updating forum category')
				})
		} else {
			dispatch(addNewForumCategory(newCategory))
				.unwrap()
				.then(() => {
					toast.success('Forum category added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchForumCategories()))
				.catch(() => {
					toast.error('Error adding forum category')
				})
		}
	}

	const getCategoryInfo = () => {
		if (categoryToEdit.id) {
			const category = forumCategories.find(c => c.id === categoryToEdit.id)
			return category
		}
	}

	useEffect(() => {
		if (categoryToEdit.id) {
			const category = getCategoryInfo()
			if (category) {
				setValue('name', category.name)
			}
		}
	}, [categoryToEdit.id])
    
	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h2>{categoryToEdit?.id ? 'Edit Forum Category' : 'Add New Forum Category'}</h2>

			<FormBox label="Category Name" error={errors?.name?.message} className="mt-4">
				<input
					id="name"
					className={`input ${errors.name ? 'input-error' : ''}`}
					{...register('name', {
						required: 'Category name is required',
						minLength: {
							value: 3,
							message: 'Category name must be at least 3 characters long',
						},
						maxLength: {
							value: 100,
							message: 'Category name must be at most 100 characters long',
						},
					})}
				/>
			</FormBox>

			<div className="mt-4 d-flex justify-content-end">
				<button type="button" className="button button--secondary me-2" onClick={handleCloseModal}>
					Cancel
				</button>
				<button type="submit" className="button button--primary">
					{categoryToEdit?.id ? 'Save Changes' : 'Add Category'}
				</button>
			</div>
		</form>
	)
}

export default ForumCategoriesForm

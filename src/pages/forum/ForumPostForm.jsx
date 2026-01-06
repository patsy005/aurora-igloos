import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { formatDateOnly, parseDateOnly } from '../../utils/utils'
import { addNewForumPost, editForumPost, fetchForumPosts } from '../../slices/forumPostsSlice'
import { fetchForumCategories } from '../../slices/forumCategorySlice'
import toast from 'react-hot-toast'
import FormBox from '../../components/Form/FormBox'
import Button from '../../components/Button'
import SelectComponent from '../../components/select/SelectComponent'
import { fetchMe, selectUser } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'

function ForumPostForm() {
	const user = useSelector(selectUser)
	const token = useSelector(state => state.auth.accessToken)

	const forumPosts = useSelector(state => state.forumPosts.forumPosts)
	const forumCategories = useSelector(state => state.forumCategories.forumCategories)
	const { closeModal, props } = useModal()
	const postToEdit = props

	const dispatch = useDispatch()

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		control,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			idEmployee: null,
			title: '',
			postContent: '',
			tags: '',
			categoryId: null,
			postDate: null,
		},
	})

	const handleCloseModal = () => closeModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchMe())
	}, [token, dispatch])

	useEffect(() => {
		dispatch(fetchForumCategories())
	}, [dispatch])

	const currentUserId = useMemo(() => user?.employeeId, [user])

	const forumCategoryOptions = useMemo(
		() => [
			{ value: '', label: 'Select forum category' },
			...forumCategories.map(method => ({ value: method.id, label: method.name })),
		],
		[forumCategories]
	)

	const onSubmit = async data => {
		// Process tags - split by comma and trim whitespace
		const tagsArray = data.tags
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0)

		const newForumPost = {
			idEmployee: +currentUserId,
			title: data.title,
			postContent: data.postContent,
			tags: tagsArray.join(','), // Backend expect comma-separated string
			categoryId: +data.categoryId,
			postDate: formatDateOnly(new Date()),
		}

		if (postToEdit?.id) {
			dispatch(editForumPost({ id: postToEdit.id, updatedForumPost: { ...newForumPost, id: postToEdit.id } }))
				.unwrap()
				.then(() => {
					toast.success('Forum post edited successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchForumPosts()))
				.catch(err => {
					toast.error('Failed to edit forum post')
					setError('formError', { type: 'server', message: err.message })
				})
		} else {
			dispatch(addNewForumPost(newForumPost))
				.unwrap()
				.then(() => {
					toast.success('Forum post added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchForumPosts()))
				.catch(err => {
					toast.error('Failed to add forum post')
					setError('formError', { type: 'server', message: err.message })
				})
		}
	}

	// Load data for editing
	useEffect(() => {
		if (!postToEdit?.id) return

		const post = forumPosts.find(post => post.id === +postToEdit.id)
		if (!post) return

		setValue('idEmployee', post.idEmployee)
		setValue('title', post.title)
		setValue('postContent', post.postContent)
		setValue('categoryId', post.categoryId)
		setValue('tags', post.tags)
		setValue('postDate', parseDateOnly(post.postDate))
	}, [postToEdit, setValue, forumPosts])

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h2>{postToEdit?.id ? 'Edit Forum Post' : 'Add New Forum Post'}</h2>

			<FormBox label="Title" error={errors?.title?.message} className="mt-4">
				<input
					id="title"
					className={`input ${errors.title ? 'input-error' : ''}`}
					{...register('title', {
						required: 'Title is required',
						minLength: {
							value: 10,
							message: 'Title must be at least 10 characters long',
						},
						maxLength: {
							value: 200,
							message: 'Title must be at most 200 characters long',
						},
					})}
				/>
			</FormBox>

			<FormBox label="Tags" error={errors?.tags?.message} className="mt-4">
				<input
					id="tags"
					className={`input ${errors.tags ? 'input-error' : ''}`}
					placeholder="Separate tags with commas (e.g., help, discussion, question)"
					{...register('tags', {
						required: 'At least one tag is required',
						pattern: {
							value: /^[a-zA-Z0-9\s,]+$/,
							message: 'Tags can only contain letters, numbers, spaces, and commas',
						},
						validate: value => {
							const tags = value
								.split(',')
								.map(tag => tag.trim())
								.filter(tag => tag.length > 0)
							if (tags.length === 0) return 'At least one tag is required'
							if (tags.some(tag => tag.length < 2)) return 'Each tag must be at least 2 characters long'
							if (tags.length > 10) return 'Maximum 10 tags allowed'
							return true
						},
					})}
				/>
			</FormBox>

			<FormBox label="Content" error={errors?.postContent?.message} className="mt-4">
				<textarea
					id="postContent"
					className={`input ${errors.postContent ? 'input-error' : ''}`}
					rows={6}
					{...register('postContent', {
						required: 'Content is required',
						minLength: {
							value: 50,
							message: 'Content must be at least 50 characters long',
						},
						maxLength: {
							value: 5000,
							message: 'Content must be at most 5000 characters long',
						},
					})}
				/>
			</FormBox>

			<FormBox label="Payment method" error={errors?.categoryId?.message} className="mt-4">
				<Controller
					name="categoryId"
					control={control}
					rules={{ required: 'Forum category is required' }}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="categoryId"
							className={`react-select ${errors.categoryId ? 'input-error' : ''}`}
							classNamePrefix="react-select"
							name="categoryId"
							options={forumCategoryOptions}
							value={forumCategoryOptions.find(option => option.value === value) ?? forumCategoryOptions[0]}
							placeholder="Select trip"
							onChangeFn={onChange}
						/>
					)}
				/>
			</FormBox>

			{errors?.formError?.message && (
				<div className="col-12 mt-4">
					<p className="error-message">{errors.formError.message}</p>
				</div>
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
				<Button type="submit">
					{isFormLoading && <Spinner className="form" />}
					{!isFormLoading && (postToEdit?.id ? 'Edit Post' : 'Add Post')}
				</Button>
			</div>
		</form>
	)
}

export default ForumPostForm

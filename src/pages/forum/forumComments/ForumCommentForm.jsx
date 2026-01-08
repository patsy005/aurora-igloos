import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, selectUser } from '../../../slices/authSlice'
import { useModal } from '../../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { addNewForumComment, editForumComment, fetchForumComments } from '../../../slices/forumCommentSlice'
import { contentArrayToMap, formatDateOnly, getContentFromMap } from '../../../utils/utils'
import toast from 'react-hot-toast'
import FormBox from '../../../components/Form/FormBox'
import Button from '../../../components/Button'
import { fetchForumPosts } from '../../../slices/forumPostsSlice'
import Spinner from '../../../components/spinner/Spinner'

function ForumCommentForm() {
	const user = useSelector(selectUser)
	const token = useSelector(state => state.auth.accessToken)
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const forumComments = useSelector(state => state.forumComments.forumComments)
	const { closeModal, props } = useModal()

	const postId = props?.postId
	const commentToEdit = props?.commentToEdit ?? null

	const dispatch = useDispatch()

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			idPost: postId,
			idEmployee: null,
			comment: '',
		},
	})
	const handleCloseModal = () => closeModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchMe())
	}, [token, dispatch])

	useEffect(() => {
		dispatch(fetchForumComments())
	}, [])

	const currentUserId = useMemo(() => user?.employeeId, [user])

	const onSubmit = data => {
		const newComment = {
			idPost: postId,
			idEmployee: currentUserId,
			comment: data.comment,
			commentDate: formatDateOnly(new Date()),
		}

		if (commentToEdit?.id) {
			dispatch(editForumComment({ id: commentToEdit.id, updatedForumComment: { ...newComment, id: commentToEdit.id } }))
				.unwrap()
				.then(() => {
					toast.success('Comment updated successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchForumComments()))
				.then(() => dispatch(fetchForumPosts()))
				.catch(error => {
					toast.error(`Failed to update comment: ${error.message}`)
				})
		} else {
			dispatch(addNewForumComment(newComment))
				.unwrap()
				.then(() => {
					toast.success('Comment added successfully')
					handleCloseModal()
				})
				.then(() => dispatch(fetchForumComments()))
				.then(() => dispatch(fetchForumPosts()))
				.catch(error => {
					toast.error(`Failed to add comment: ${error.message}`)
				})
		}
	}

	useEffect(() => {
		if (!postId || !commentToEdit?.id) return

		const comment = forumComments.find(c => c.id === commentToEdit.id && c.idPost === postId)
		if (comment) setValue('comment', comment.comment)
	}, [postId, commentToEdit?.id, forumComments, setValue])

	if (!postId) return null

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h2>
				{commentToEdit?.id
					? getContentFromMap(contentMap, 'forumComment.edit', 'Edit Forum Comment')
					: getContentFromMap(contentMap, 'forumComment.form.add', 'Add New Forum Comment')}
			</h2>

			<FormBox
				label={getContentFromMap(contentMap, 'forumPost.label.content', 'Content')}
				error={errors?.comment?.message}
				className="mt-4">
				<textarea
					id="comment"
					className={`input ${errors.comment ? 'input-error' : ''}`}
					rows={6}
					{...register('comment', {
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

			<div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						handleCloseModal()
					}}
					type={'button'}>
					{getContentFromMap(contentMap, 'form.saveChanges', 'Cancel')}
				</Button>
				<Button type="submit">
					{isFormLoading && <Spinner className="form" />}
					{!isFormLoading &&
						(commentToEdit?.id
							? getContentFromMap(contentMap, 'forumComment.editBtn', 'Edit Comment')
							: getContentFromMap(contentMap, 'forumComment.addBtn', 'Add Comment'))}
				</Button>
			</div>
		</form>
	)
}

export default ForumCommentForm

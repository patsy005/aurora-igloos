// import { useDispatch, useSelector } from 'react-redux'
// import { fetchMe, selectUser } from '../../../slices/authSlice'
// import { useModal } from '../../../contexts/modalContext'
// import { useForm } from 'react-hook-form'
// import { useEffect, useMemo } from 'react'
// import { addNewForumComment, editForumComment, fetchForumComments } from '../../../slices/forumCommentSlice'
// import { formatDateOnly } from '../../../utils/utils'
// import toast from 'react-hot-toast'
// import FormBox from '../../../ui/Form/FormBox'
// import Button from '../../../components/Button'

// function ForumCommentForm() {
// 	const user = useSelector(selectUser)
// 	const token = useSelector(state => state.auth.accessToken)

// 	const forumComments = useSelector(state => state.forumComments.forumComments)
// 	const { closeModal, props } = useModal()

// 	const postId = props?.postId
// 	const commentToEdit = props?.commentToEdit ?? null

// 	const dispatch = useDispatch()

// 	const {
// 		register,
// 		handleSubmit,
// 		setValue,
// 		setError,
// 		control,
// 		formState: { errors },
// 	} = useForm({
// 		defaultValues: {
// 			idPost: postId,
// 			idEmployee: null,
// 			comment: '',
// 		},
// 	})
// 	const handleCloseModal = () => closeModal()

// 	useEffect(() => {
// 		if (!token) return
// 		dispatch(fetchMe())
// 	}, [])

// 	useEffect(() => {
// 		dispatch(fetchForumComments())
// 	}, [])

// 	const currentUserId = useMemo(() => user?.employeeId, [user])

// 	const onSubmit = data => {
// 		const newComment = {
// 			idPost: postId,
// 			idEmployee: currentUserId,
// 			comment: data.comment,
// 			commentDate: formatDateOnly(new Date()),
// 		}

// 		if (commentToEdit?.id) {
// 			dispatch(editForumComment({ id: commentToEdit.id, updatedForumComment: { ...newComment, id: commentToEdit.id } }))
// 				.unwrap()
// 				.then(() => {
// 					toast.success('Comment updated successfully')
// 					handleCloseModal()
// 				})
// 				.catch(error => {
// 					toast.error(`Failed to update comment: ${error.message}`)
// 				})
// 		} else {
// 			dispatch(addNewForumComment(newComment))
// 				.unwrap()
// 				.then(() => {
// 					toast.success('Comment added successfully')
// 					handleCloseModal()
// 				})
// 				.catch(error => {
// 					toast.error(`Failed to add comment: ${error.message}`)
// 				})
// 		}
// 	}

// 	useEffect(() => {
// 		if (!postId && !commentToEdit?.id) return

// 		const comment = forumComments.find(c => c.id === commentToEdit.id && c.idPost === postId)
// 		if (comment) {
// 			setValue('comment', comment.comment)
// 		}
// 	}, [postId, commentToEdit, forumComments, setValue])

//     if(!postId) return null;

// 	return (
// 		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
// 			<h2>{commentToEdit?.id ? 'Edit Forum Comment' : 'Add New Forum Comment'}</h2>

// 			<FormBox label="Content" error={errors?.comment?.message} className="mt-4">
// 				<textarea
// 					id="comment"
// 					className={`input ${errors.comment ? 'input-error' : ''}`}
// 					rows={6}
// 					{...register('comment', {
// 						required: 'Content is required',
// 						minLength: {
// 							value: 50,
// 							message: 'Content must be at least 50 characters long',
// 						},
// 						maxLength: {
// 							value: 5000,
// 							message: 'Content must be at most 5000 characters long',
// 						},
// 					})}
// 				/>
// 			</FormBox>

// 			<div className="d-flex justify-content-end text-end form-btns">
// 				<Button
// 					className="cancel-btn"
// 					onClick={() => {
// 						handleCloseModal()
// 					}}
// 					type={'button'}>
// 					Cancel
// 				</Button>
// 				<Button type="submit">{commentToEdit?.id ? 'Edit Comment' : 'Add Comment'}</Button>
// 			</div>
// 		</form>
// 	)
// }

// export default ForumCommentForm

import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, selectUser } from '../../../slices/authSlice'
import { useModal } from '../../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { addNewForumComment, editForumComment, fetchForumComments } from '../../../slices/forumCommentSlice'
import { formatDateOnly } from '../../../utils/utils'
import toast from 'react-hot-toast'
import FormBox from '../../../ui/Form/FormBox'
import Button from '../../../components/Button'
import { fetchForumPosts } from '../../../slices/forumPostsSlice'

function ForumCommentForm() {
	const dispatch = useDispatch()

	const user = useSelector(selectUser)
	const token = useSelector(state => state.auth.accessToken)
	const forumComments = useSelector(state => state.forumComments.forumComments)

	const modal = useModal()

	// ✅ HARD GUARD: jeśli modal jeszcze nie podał propsów, nie renderuj nic
	if (!modal || !modal.props) return null

	const { closeModal, props } = modal
	const postId = props.postId
	const commentToEdit = props.commentToEdit ?? null

	// ✅ jeśli postId nie istnieje, nie renderuj formularza (żeby nie renderować FormBox)
	if (!postId) return null

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: { comment: '' },
	})

	const currentUserId = useMemo(() => user?.employeeId, [user])

	useEffect(() => {
		if (!token) return
		dispatch(fetchMe())
	}, [token, dispatch])

	useEffect(() => {
		dispatch(fetchForumComments())
	}, [dispatch])

	useEffect(() => {
		if (!commentToEdit?.id) return
		const comment = forumComments.find(c => c.id === commentToEdit.id && c.idPost === postId)
		if (comment) setValue('comment', comment.comment)
	}, [commentToEdit?.id, forumComments, postId, setValue])

	const onSubmit = async data => {
		const newComment = {
			idPost: postId,
			idEmployee: currentUserId,
			comment: data.comment,
			commentDate: formatDateOnly(new Date()),
		}

		try {
			if (commentToEdit?.id) {
				await dispatch(
					editForumComment({
						id: commentToEdit.id,
						updatedForumComment: { ...newComment, id: commentToEdit.id },
					})
				)
					.unwrap()
					.then(() => {
						toast.success('Comment updated successfully')
						closeModal()
					})
					.then(() => fetchForumPosts())
					.catch(error => {
						toast.error(`Failed to update comment: ${error.message}`)
					})
			} else {
				await dispatch(addNewForumComment(newComment))
					.unwrap()
					.then(() => {
						toast.success('Comment added successfully')
						closeModal()
					})
					.then(() => fetchForumPosts())
					.catch(error => {
						toast.error(`Failed to add comment: ${error.message}`)
					})
			}

			closeModal()
			dispatch(fetchForumPosts())
		} catch {
			toast.error('Operation failed')
		}
	}

	// ✅ tworzysz child jako element — zawsze dokładnie 1 element
	const commentField = (
		<textarea
			id="comment"
			className={`input ${errors?.comment ? 'input-error' : ''}`}
			rows={6}
			{...register('comment', {
				required: 'Comment is required',
				maxLength: { value: 2000, message: 'Comment cannot exceed 2000 characters' },
			})}
		/>
	)

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h2>{commentToEdit?.id ? 'Edit Forum Comment' : 'Add New Forum Comment'}</h2>

			{/* ✅ FormBox renderuje się tylko gdy mamy gotowy child */}
			{commentField && (
				<FormBox label="Post Title" error={errors?.comment?.message} className="mt-4">
					{commentField}
				</FormBox>
			)}

			<div className="d-flex justify-content-end text-end form-btns">
				<Button className="cancel-btn" onClick={closeModal} type="button">
					Cancel
				</Button>
				<Button type="submit">{commentToEdit?.id ? 'Edit Comment' : 'Add Comment'}</Button>
			</div>
		</form>
	)
}

export default ForumCommentForm

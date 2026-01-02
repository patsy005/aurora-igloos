import moment from 'moment'
import { selectCanDelete, selectCanManage } from '../../../slices/authSlice'
import { useSelector } from 'react-redux'
import { useModal } from '../../../contexts/modalContext'
import ForumCommentForm from './ForumCommentForm'
import DeleteConfirmation from '../../../components/deleteConfirmation/DeleteConfirmation'
import { DeleteIcon, EditIcon } from '../../../ui/Icons'

function ForumCommentItem({ comment }) {
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const { openModal } = useModal()

	const openEditForumCommentModal = () => {
		openModal(ForumCommentForm, { postId: comment.idPost, commentToEdit: comment })
	}

	const openDeleteForumCommentModal = () => {
		openModal(DeleteConfirmation, { id: comment.id, category: 'forum-comment', itemToDelete: comment })
	}

	return (
		<div className="forum-comment d-flex gap-4 justify-content-between">
			<div className="d-flex gap-4">
				<img
					className="forum-comment__avatar"
					src={`http://localhost:5212/${comment.employeePhotoUrl}`}
					alt={comment.employeeName}
				/>

				<div className="forum-comment__content">
					<div className="forum-comment__meta">
						<span className="author">
							{comment.employeeName} {comment.employeeSurname}
						</span>
						<span className="dot">•</span>
						<span className="date">{moment(comment.commentDate).format('MMM D, YYYY')}</span>
					</div>

					<p className="forum-comment__text">{comment.comment}</p>
				</div>
			</div>

			<div className="bookings-table__actions justify-content-end align-items-end">
				{canManage && (
					<span onClick={() => openEditForumCommentModal(comment.id)}>
						<EditIcon />
					</span>
				)}
				{canDelete && (
					<span className="delete-icon" onClick={() => openDeleteForumCommentModal(comment.id)}>
						<DeleteIcon />
					</span>
				)}
			</div>
		</div>
	)
}

export default ForumCommentItem

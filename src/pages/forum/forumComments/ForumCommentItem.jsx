import moment from 'moment'

function ForumCommentItem({ comment }) {
	return (
		<div className="forum-comment d-flex gap-4">
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
	)
}

export default ForumCommentItem

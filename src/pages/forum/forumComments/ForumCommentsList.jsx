import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ForumCommentItem from './ForumCommentItem'
import SectionHeading from '../../../components/SectionHeading'
import { GoBackIcon } from '../../../ui/Icons'

function ForumCommentsList() {
	const { postId } = useParams()
	const posts = useSelector(state => state.forumPosts.forumPosts)
	const postComments = posts.find(p => p.id === +postId).forumComment
	const postTitle = posts.find(p => p.id === +postId).title
	const navigate = useNavigate()

	if (!postComments) return <div>No comments found. </div>

	console.log(postComments)
	return (
		<div className="d-flex flex-column gap-3 mt-4">
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<div className="comments-thread">
				<p className="thread-label">Discussion</p>
				<h2 className="thread-title">{postTitle}</h2>
			</div>

			{postComments.map(comment => {
				return <ForumCommentItem key={comment.id} comment={comment} />
			})}
		</div>
	)
}

export default ForumCommentsList

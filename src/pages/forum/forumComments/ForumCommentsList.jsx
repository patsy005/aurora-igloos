import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ForumCommentItem from './ForumCommentItem'
import SectionHeading from '../../../components/SectionHeading'
import { GoBackIcon } from '../../../ui/Icons'
import { selectCanManage } from '../../../slices/authSlice'
import { useModal } from '../../../contexts/modalContext'
import Button from '../../../components/Button'
import ForumCommentForm from './ForumCommentForm'
import { useEffect } from 'react'
import { fetchForumPosts } from '../../../slices/forumPostsSlice'

function ForumCommentsList() {
	const { postId } = useParams()
	const posts = useSelector(state => state.forumPosts.forumPosts)

	const canManage = useSelector(selectCanManage)

	const navigate = useNavigate()
	const { openModal } = useModal()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchForumPosts())
	}, [])

	const post = posts.find(p => p.id === +postId)

	if (!post) return <div>Post not found.</div>

	const postComments = post.forumComment
	const postTitle = post.title

	const openAddCommentModal = () => {
		openModal(ForumCommentForm, { postId: +postId })
	}
	return (
		<div className="d-flex flex-column gap-3 mt-4">
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddCommentModal}>Add Comment</Button>
				</div>
			)}
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

import moment from 'moment'
import { CommentIcon } from '../../ui/Icons'
import { useNavigate } from 'react-router-dom'

function ForumPostsItem({ post }) {
	const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : []
	const navigate = useNavigate()

	return (
		<div className="forum__item d-md-flex gap-5">
			<div className="forum__item--left d-none d-md-block">
				<img src={`http://localhost:5212/${post.employee.photoUrl}`} alt={post.employee.name} />
			</div>
			<div className="forum__item--right d-flex flex-column gap-3 gap-md-4 gap-lg-5">
				<div
					className="forum__item--top d-flex flex-column gap-2 flex-lg-row
                    justify-content-lg-between align-items-lg-center">
					<p className="title">{post.title}</p>
					<p className="date">{moment(post.postDate).format('MMM Do YY')}</p>
				</div>

				{post.postContent && <p className="description">{post.postContent}</p>}

				<div className="forum__item--bottom d-flex flex-column flex-lg-row justify-content-lg-between gap-3 gap-md-4 gap-lg-5">
					<div className="tags d-flex flex-column gap-2 gap-md-3 align-items-start flex-md-row justify-content-between justify-content-lg-start">
						{tags.map(tag => (
							<div key={tag} className="tag">
								{tag}
							</div>
						))}
					</div>
					<div
						className="comments d-flex align-items-center justify-content-lg-end w-50"
						onClick={() => navigate(`/forum-comments/${post.id}`)}>
						<span className="icon">
							<CommentIcon />
						</span>
						<span className="commentCount">{post.numberOfComment}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ForumPostsItem

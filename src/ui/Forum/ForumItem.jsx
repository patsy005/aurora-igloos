import moment from 'moment'
import { CommentIcon } from '../Icons'
import data from '../../../public/data.json'

function ForumItem({ post }) {
	const users = data.users
	const user = users.find(user => user.id === post.userId)

	return (
		<div className="forum__item d-md-flex gap-5">
			<div className="forum__item--left d-none d-md-block">
				<img src={user.img} alt="User image" />
			</div>
			<div className="forum__item--right d-flex flex-column gap-3 gap-md-4 gap-lg-5">
				<div
					className="forum__item--top d-flex flex-column gap-2 flex-lg-row
                justify-content-lg-between align-items-lg-center">
					<p className="title">{post.topic}</p>
					<p className="date">{moment(post.data).format('MMM Do YY')}</p>
				</div>

				{post.description && <p className="description">{post.description}</p>}

				<div className="forum__item--bottom d-flex flex-column flex-lg-row justify-content-lg-between gap-3 gap-md-4 gap-lg-5">
					<div className="tags d-flex flex-column gap-2 gap-md-3 align-items-start flex-md-row justify-content-between justify-content-lg-start">
						{post.tags.map(tag => (
							<div key={tag} className="tag">
								{tag}
							</div>
						))}
					</div>
					<div className="comments d-flex align-items-center justify-content-lg-end w-50">
						<span className="icon">
							<CommentIcon />
						</span>
						<span className="commentCount">{post.commentsCount}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ForumItem

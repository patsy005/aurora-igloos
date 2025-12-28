import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchForumPosts } from '../../slices/forumPostsSlice'
import { useModal } from '../../contexts/modalContext'
import ForumPostForm from './ForumPostForm'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import ForumActions from './ForumActions'
import ForumPostsList from './ForumPostsList'
import { selectCanManage } from '../../slices/authSlice'

function ForumPosts() {
	const dispatch = useDispatch()
	const forumPosts = useSelector(state => state.forumPosts.forumPosts)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchForumPosts())
	}, [token])

	if (!forumPosts.length) return null

	const openAddForumPostModal = () => {
		openModal(ForumPostForm)
	}
	return (
		<>
			<SectionHeading sectionTitle="Forum Posts" />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddForumPostModal}>Add Forum Post</Button>
				</div>
			)}

			<div className="forum">
				<ForumActions />
				<ForumPostsList posts={forumPosts} />
			</div>
		</>
	)
}

export default ForumPosts

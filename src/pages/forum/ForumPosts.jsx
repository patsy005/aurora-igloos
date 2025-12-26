import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchForumPosts } from '../../slices/forumPostsSlice'
import { useModal } from '../../contexts/modalContext'
import ForumPostForm from './ForumPostForm'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import ForumActions from './ForumActions'
import ForumPostsList from './ForumPostsList'

function ForumPosts() {
	const dispatch = useDispatch()
	const forumPosts = useSelector(state => state.forumPosts.forumPosts)
	const { openModal } = useModal()

	useEffect(() => {
		dispatch(fetchForumPosts())
	}, [])

	if (!forumPosts.length) return null

	const openAddForumPostModal = () => {
		openModal(ForumPostForm)
	}
	return (
		<>
			<SectionHeading sectionTitle="Forum Posts" />
			<div className="text-end">
				<Button onClick={openAddForumPostModal}>Add Forum Post</Button>
			</div>

			<div className="forum">
				<ForumActions />
				<ForumPostsList posts={forumPosts} />
			</div>
		</>
	)
}

export default ForumPosts

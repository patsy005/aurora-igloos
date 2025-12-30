import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchForumPosts } from '../../slices/forumPostsSlice'
import { useModal } from '../../contexts/modalContext'
import ForumPostForm from './ForumPostForm'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import ForumActions from './ForumActions'
import ForumPostsList from './ForumPostsList'
import { selectCanManage } from '../../slices/authSlice'
import SearchInput from '../../components/SearchInput'
import { useNavigate } from 'react-router-dom'
import { GoBackIcon } from '../../ui/Icons'

function ForumPosts() {
	const [search, setSearch] = useState('')
	const dispatch = useDispatch()
	const forumPosts = useSelector(state => state.forumPosts.forumPosts)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const { openModal } = useModal()
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) return
		dispatch(fetchForumPosts())
	}, [token])

	const filteredPosts = useMemo(() => {
		const query = search.toLowerCase().trim()
		if (!query) return forumPosts

		return forumPosts.filter(p => {
			const tags = (p.tags ?? '').toLowerCase()
			const title = (p.title ?? '').toLowerCase()
			const content = (p.postContent ?? '').toLowerCase()
			const author = `${p.employeeName ?? ''} ${p.employeeSurname ?? ''}`.toLowerCase()

			return tags.includes(query) || title.includes(query) || content.includes(query) || author.includes(query)
		})
	}, [forumPosts, search])

	if (!forumPosts.length) return null

	const openAddForumPostModal = () => {
		openModal(ForumPostForm)
	}
	return (
		<>
			<SectionHeading sectionTitle="Forum Posts" />
			<div>
				<span onClick={() => navigate('/forum-categories')} className="text-link">
					Forum Categories
					<span>
						<GoBackIcon />
					</span>
				</span>
			</div>
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddForumPostModal}>Add Forum Post</Button>
				</div>
			)}

			<div className="forum">
				{/* <ForumActions search={search} setSerch={setSearch} /> */}
				<div className="mt-4 d-flex justify-content-end">
					<SearchInput value={search} onChange={setSearch} placeholder="Search posts" />
				</div>
				<ForumPostsList posts={filteredPosts} />
			</div>
		</>
	)
}

export default ForumPosts

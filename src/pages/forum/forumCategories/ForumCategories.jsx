import { useDispatch, useSelector } from 'react-redux'
import { selectCanManage } from '../../../slices/authSlice'
import { useModal } from '../../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { fetchForumCategories } from '../../../slices/forumCategorySlice'
import SectionHeading from '../../../components/SectionHeading'
import Button from '../../../components/Button'
import ForumCategoriesTable from './ForumCategoriesTable'
import ForumCategoriesForm from './ForumCategoriesForm'
import { useNavigate } from 'react-router-dom'
import { GoBackIcon } from '../../../ui/Icons'
import Spinner from '../../../components/spinner/Spinner'
import { contentArrayToMap, getContentFromMap } from '../../../utils/utils'

function ForumCategories() {
	const dispatch = useDispatch()
	const forumCategories = useSelector(state => state.forumCategories.forumCategories)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetching = useSelector(state => state.forumCategories.isFetching)
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])
	const { openModal } = useModal()
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) return
		dispatch(fetchForumCategories())
	}, [token, dispatch])

	if (!forumCategories.length) return null

	const openAddForumCategoryModal = () => {
		openModal(ForumCategoriesForm)
	}

	if (isFetching) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle={getContentFromMap(contentMap, 'forumCategories.heading', 'Forum Categories')} />
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddForumCategoryModal}>
						{getContentFromMap(contentMap, 'forumCategories.cta', 'Add Forum Category')}
					</Button>
				</div>
			)}
			<ForumCategoriesTable />
		</>
	)
}

export default ForumCategories

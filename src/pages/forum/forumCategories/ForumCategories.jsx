import { useDispatch, useSelector } from 'react-redux'
import { selectCanManage } from '../../../slices/authSlice'
import { useModal } from '../../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchForumCategories } from '../../../slices/forumCategorySlice'
import SectionHeading from '../../../components/SectionHeading'
import Button from '../../../components/Button'
import ForumCategoriesTable from './ForumCategoriesTable'
import ForumCategoriesForm from './ForumCategoriesForm'
import { useNavigate } from 'react-router-dom'
import { GoBackIcon } from '../../../ui/Icons'
import Spinner from '../../../components/spinner/Spinner'

function ForumCategories() {
	const dispatch = useDispatch()
	const forumCategories = useSelector(state => state.forumCategories.forumCategories)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetching = useSelector(state => state.forumCategories.isFetching)
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
			<SectionHeading sectionTitle="Forum Categories" />
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddForumCategoryModal}>Add Forum Category</Button>
				</div>
			)}
			<ForumCategoriesTable />
		</>
	)
}

export default ForumCategories

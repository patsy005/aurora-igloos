import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { setIsCreating } from '../../slices/forum'
import Button from '../../components/Button'
import ForumList from './ForumList'
import ForumActions from './ForumActions'
import ForumForm from './ForumForm'

function ForumView() {
	const isCreating = useSelector(state => state.forum.isCreating)
	const dispatch = useDispatch()

	const handleAddBooking = () => {
		dispatch(setIsCreating(true))
	}
	return (
		<>
			<SectionHeading sectionTitle="forum" />
			<div className="text-end">{!isCreating && <Button onClick={handleAddBooking}>Add post</Button>}</div>

			{isCreating && <ForumForm />}
			
			<div className="forum">
				<ForumActions />
				<ForumList />
			</div>
		</>
	)
}

export default ForumView
